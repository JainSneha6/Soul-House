from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from flask_cors import CORS
import re
from flask import session
import mysql.connector
from sqlalchemy import text, create_engine
import datetime
from flask import session, redirect, url_for

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:<Password>@localhost:3306/soulhouse'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Users(db.Model):
    __tablename__="users"
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(100), nullable=False)
    lastName = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    
class Songs(db.Model):
    SongId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    SongName = db.Column(db.String(100))
    Language = db.Column(db.String(100))
    Genre = db.Column(db.String(100))
    Artist = db.Column(db.String(100))
    Lyricist = db.Column(db.String(100))
    Composer = db.Column(db.String(100))
    Album = db.Column(db.String(100))
    Duration = db.Column(db.String(100))
    
class SongsFinal(db.Model):
    __tablename__="songsfinal"
    SongId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    SongName = db.Column(db.String(100))
    Language = db.Column(db.String(100))
    Genre = db.Column(db.String(100))
    Artist = db.Column(db.String(100))
    Lyricist = db.Column(db.String(100))
    Composer = db.Column(db.String(100))
    Album = db.Column(db.String(100))
    Duration = db.Column(db.String(100))
    
class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    feedback = db.Column(db.String(100))
    song_title = db.Column(db.String(100)) 
    
class Playlist(db.Model):
    __tablename__ = "playlist"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('userslogin.id', ondelete='CASCADE'), nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey('songs.SongId'), nullable=False)
    song_title = db.Column(db.String(100), nullable=False) 
    

class PlaylistLog(db.Model):
    __tablename__ = 'playlist_log'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer)
    song_id = db.Column(db.Integer)
    action = db.Column(db.String(10))
    timestamp = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    def __repr__(self):
        return f"<PlaylistLog(id={self.id}, user_id={self.user_id}, song_id={self.song_id}, action={self.action}, timestamp={self.timestamp})>"
    
    
class UsersLogin(db.Model):
    __tablename__="userslogin"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    
    
@app.route('/playlist/add', methods=['GET','POST'])
def add_to_playlist():
    if request.method == "GET":
        playlist = Playlist.query.all()
        playlist_list = []
        for p in playlist:
            playlist_data = {
                'id': p.id,
                'user_id': p.user_id,
                'song_id': p.song_id,
                'song_title': p.song_title
            }
            playlist_list.append(playlist_data)
        return jsonify(users=playlist_list)
    elif request.method=='POST':
        data = request.json
        if data:
            user_id = data.get('user_id')
            song_id = data.get('song_id')
            song_title=data.get('song_title')
            if user_id is None or song_id is None or song_title is None:
                return jsonify({'error': 'Missing required fields'}), 400
            new_playlist_entry = Playlist(user_id=user_id, song_id=song_id, song_title=song_title)
            db.session.add(new_playlist_entry)
            db.session.commit()
            log_playlist_action(user_id, song_id, 'ADD')
            return jsonify({'message': 'Song added to playlist successfully'})
        else:
            return jsonify({'error': 'Invalid request'}), 400
    
@app.route('/playlist/remove', methods=['GET','POST'])
def remove_from_playlist():
    if request.method == "GET":
        playlist = Playlist.query.all()
        playlist_list = []
        for p in playlist:
            playlist_data = {
                'id': p.id,
                'user_id': p.user_id,
                'song_id': p.song_id,
                'song_title': p.song_title
            }
            playlist_list.append(playlist_data)
        return jsonify(users=playlist_list)
    elif request.method=='POST':
        data = request.json
        if data:
            user_id = data.get('user_id')
            song_id = data.get('song_id')
            song_title=data.get('song_title')
            playlist_entry = Playlist.query.filter_by(user_id=user_id, song_id=song_id, song_title=song_title).first()
            if playlist_entry:
                db.session.delete(playlist_entry)
                db.session.commit()
                log_playlist_action(user_id, song_id, 'REMOVE')
                return jsonify({'message': 'Song removed from playlist successfully'})
            else:
                return jsonify({'error': 'Song not found in playlist'}), 404
        else:
            return jsonify({'error': 'Invalid request'}), 400
        
def log_playlist_action(user_id, song_id, action):
    try:
        with db.engine.connect() as conn:
            conn.execute(text("""
                INSERT INTO playlist_log (user_id, song_id, action, timestamp)
                VALUES (:user_id, :song_id, :action, :timestamp)
            """), user_id=user_id, song_id=song_id, action=action, timestamp=datetime.now())
    except Exception as e:
        print(f"Error logging playlist action: {str(e)}")
    
@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == "GET":
        users = UsersLogin.query.all()
        user_list = []
        for user in users:
            user_data = {
                'id': user.id,
                'email': user.email,
                'password': user.password
            }
            user_list.append(user_data)
        return jsonify(user_ids=[user['id'] for user in user_list])
    elif request.method == "POST":
        data = request.json
        if data:
            email = data.get('email')
            password = data.get('password')
            user = Users.query.filter_by(email=email, password=password).first()
            user_login=UsersLogin.query.filter_by(email=email, password=password).first()
            if user_login:
                return jsonify({'message': 'Already LoggedIn'})
            else:
                if user:
                    new_user = UsersLogin(email=email, password=password)
                    db.session.add(new_user)
                    db.session.commit() 
                    return jsonify({'message': 'Login successful'})
                else:
                    return jsonify({'error': 'Invalid credentials'}), 401
        else:
            return jsonify({'error': 'Invalid request'}), 400
        
        
@app.route('/user-credentials', methods=['GET'])
def user_credentials():
    if request.method == "GET":
        users = UsersLogin.query.all()
        user_list = []
        for user in users:
            user_data = {
                'id': user.id,
                'email': user.email,
                'password': user.password
            }
            user_list.append(user_data)
        return jsonify(users=user_list)
        

@app.route('/logout', methods=['POST'])
def logout():
    data = request.json
    if data:
        id=data.get('id')
        email = data.get('email')
        password = data.get('password')
        user_login = UsersLogin.query.filter_by(id=id, email=email, password=password).first()
        if user_login:
            db.session.delete(user_login) 
            db.session.commit()
            return jsonify({'message': 'Logout successful'})
        else:
            return jsonify({'error': 'User not logged in'}), 401
    else:
        return jsonify({'error': 'Invalid request'}), 400

@app.route('/signup', methods=['GET','POST'])
def signup():
    if request.method == "GET":
        users = Users.query.all()
        user_list = []
        for user in users:
            user_data = {
                'id': user.id,
                'firstName': user.firstName,
                'lastName': user.lastName,
                'email': user.email,
                'phone': user.phone,
                'password': user.password
            }
            user_list.append(user_data)
        return jsonify(users=user_list)
    elif request.method == "POST":
        data = request.json
        if data:
            new_user = Users(
                firstName=data['firstName'],
                lastName=data['lastName'],
                email=data['email'],
                phone=data['phone'],
                password=data['password']
            )
            db.session.add(new_user)
            db.session.commit()
            return jsonify({'message': 'User signed up successfully'})
        else:
            return jsonify({'error': 'Invalid request'}), 400

        
@app.route('/feedback', methods=['GET','POST'])
def feedback():
    if request.method == "GET":
        feedback = Feedback.query.all()
        feedback_list = []
        for f in feedback:
            feedback_data = {
                'id': f.id,
                'feedback': f.feedback,
                'song_title': f.song_title
            }
            feedback_list.append(feedback_data)
        return jsonify(feedback=feedback_list)
    
    elif request.method == "POST":
        data = request.json
        if data:
            new_feedback = Feedback(
                feedback=data['feedback'],
                song_title=data['song_title'] 
            )
            db.session.add(new_feedback)
            db.session.commit()
            return jsonify({'message': 'Feedback Recorded successfully'})
        else:
            return jsonify({'error': 'Invalid request'}), 400
        
@app.route('/playlist/<int:user_id>/<int:song_id>', methods=['GET'])
def check_song_in_playlist(user_id, song_id):
    playlist_entry = Playlist.query.filter_by(user_id=user_id, song_id=song_id).first()
    if playlist_entry:
        return jsonify({'isInPlaylist': True})
    else:
        return jsonify({'isInPlaylist': False})
    
    
def create_stored_procedures():
    try:
        stored_procedures_sql = [
            """
            CREATE PROCEDURE GetSongsByLang(IN lang VARCHAR(100))
            BEGIN
                SELECT * FROM SongsFinal WHERE Language = lang;
            END;
            """,
            """
            CREATE PROCEDURE GetSongsByAlbum(IN album_name VARCHAR(255))
            BEGIN
                SELECT * FROM SongsFinal WHERE Album = album_name;
            END;
            """,
            """
            CREATE PROCEDURE GetSongsByComposer(IN composer_name VARCHAR(255))
            BEGIN
                SELECT * FROM SongsFinal WHERE Composer = composer_name;
            END;
            """,
            """
            CREATE PROCEDURE GetSongsByLyricist(IN lyricist_name VARCHAR(255))
            BEGIN
                SELECT * FROM SongsFinal WHERE Lyricist = lyricist_name;
            END;
            """,
            """
            CREATE PROCEDURE GetSongsByGenre(IN genre_name VARCHAR(255))
            BEGIN
                SELECT * FROM SongsFinal WHERE Genre = genre_name;
            END;
            """,
            """
            CREATE PROCEDURE GetSongsByArtist(IN artist_name VARCHAR(255))
            BEGIN
                SELECT * FROM SongsFinal WHERE Artist = artist_name;
            END;
            """
        ]

        # Create the stored procedures
        with db.engine.connect() as conn:
            for stored_procedure_sql in stored_procedures_sql:
                conn.execute(text(stored_procedure_sql))

        return {'message': 'Stored procedures created successfully'}
    except Exception as e:
        return {'error': str(e)}

@app.route('/songs/language/<language>', methods=['GET'])
def get_songs_by_language(language):
    try:
        connection = db.engine.raw_connection()

        query = "CALL GetSongsByLang(%s)"
        cursor = connection.cursor()
        cursor.execute(query, (language,))

        songs = []
        for row in cursor.fetchall():
            song_data = {
                'SongName': row[1],
                'Language': row[2],
            }
            songs.append(song_data)

        cursor.close()
        connection.close()

        return jsonify({'songs': songs})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/songs/album/<album>', methods=['GET'])
def get_songs_by_album(album):
    try:
        connection = db.engine.raw_connection()

        query = "CALL GetSongsByAlbum(%s)"
        cursor = connection.cursor()
        cursor.execute(query, (album,))

        songs = []
        for row in cursor.fetchall():
            song_data = {
                'SongName': row[1],
                'Album': row[7],
            }
            songs.append(song_data)

        cursor.close()
        connection.close()

        return jsonify({'songs': songs})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/songs/composer/<composer>', methods=['GET'])
def get_songs_by_composer(composer):
    try:
        connection = db.engine.raw_connection()

        query = "CALL GetSongsByComposer(%s)"
        cursor = connection.cursor()
        cursor.execute(query, (composer,))

        songs = []
        for row in cursor.fetchall():
            song_data = {
                'SongName': row[1],
                'Composer': row[6],
            }
            songs.append(song_data)

        cursor.close()
        connection.close()

        return jsonify({'songs': songs})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/songs/lyricist/<lyricist>', methods=['GET'])
def get_songs_by_lyricist(lyricist):
    try:
        connection = db.engine.raw_connection()

        query = "CALL GetSongsByLyricist(%s)"
        cursor = connection.cursor()
        cursor.execute(query, (lyricist,))

        songs = []
        for row in cursor.fetchall():
            song_data = {
                'SongName': row[1],
                'Lyricist': row[5]
            }
            songs.append(song_data)

        cursor.close()
        connection.close()

        return jsonify({'songs': songs})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/songs/genre/<genre>', methods=['GET'])
def get_songs_by_genre(genre):
    try:
        connection = db.engine.raw_connection()

        query = "CALL GetSongsByGenre(%s)"
        cursor = connection.cursor()
        cursor.execute(query, (genre,))

        songs = []
        for row in cursor.fetchall():
            song_data = {
                'SongName': row[1],
                'Genre': row[3]
            }
            songs.append(song_data)

        cursor.close()
        connection.close()

        return jsonify({'songs': songs})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

        
@app.route('/songs/artist/<artist>', methods=['GET'])
def get_songs_by_artist(artist):
    try:
        connection = db.engine.raw_connection()

        # Prepare and execute the query
        query = "CALL GetSongsByArtist(%s)"
        cursor = connection.cursor()
        cursor.execute(query, (artist,))

        # Fetch the results
        songs = []
        for row in cursor.fetchall():
            song_data = {
                'SongName': row[1],
                'Artist': row[4]
            }
            songs.append(song_data)

        # Close cursor and connection
        cursor.close()
        connection.close()

        return jsonify({'songs': songs})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
def create_triggers():
    try:
        with db.engine.connect() as conn:
            conn.execute(text("""
                DROP TRIGGER IF EXISTS playlist_after_insert;
                CREATE TRIGGER playlist_after_insert
                AFTER INSERT ON playlist
                FOR EACH ROW
                BEGIN
                    INSERT INTO playlist_log (user_id, song_id, action, timestamp)
                    VALUES (NEW.user_id, NEW.song_id, 'INSERT', NOW());
                END;
            """))

            conn.execute(text("""
                DROP TRIGGER IF EXISTS playlist_after_delete;
                CREATE TRIGGER playlist_after_delete
                AFTER DELETE ON playlist
                FOR EACH ROW
                BEGIN
                    INSERT INTO playlist_log (user_id, song_id, action, timestamp)
                    VALUES (OLD.user_id, OLD.song_id, 'DELETE', NOW());
                END;
            """))

        print("Triggers created successfully")
    except Exception as e:
        print(f"Error creating triggers: {str(e)}")

def insert_data():
    songs_data = [
        {'SongName': 'Attention', 'Language': 'English', 'Genre': 'Pop', 'Artist': 'Charlie Puth', 'Lyricist': 'Charlie Puth', 'Composer': 'Charlie Puth', 'Album': 'Voicenotes', 'Duration': '3:31'},
        {'SongName': 'Lover', 'Language': 'English', 'Genre': 'Pop', 'Artist': 'Taylor Swift', 'Lyricist': 'Taylor Swift', 'Composer': 'Taylor Swift, Jack Antonoff', 'Album': 'Lover', 'Duration': '3:41'},
        {'SongName': 'Middle of the Night', 'Language': 'English', 'Genre': 'Pop', 'Artist': 'The Vamps', 'Lyricist': 'The Vamps', 'Composer': 'The Vamps', 'Album': 'Night & Day', 'Duration': '3:19'},
        {'SongName': 'Perfect', 'Language': 'English', 'Genre': 'Pop', 'Artist': 'Ed Sheeran', 'Lyricist': 'Ed Sheeran', 'Composer': 'Ed Sheeran', 'Album': 'Divide', 'Duration': '4:23'},
        {'SongName': 'Shape of You', 'Language': 'English', 'Genre': 'Pop', 'Artist': 'Ed Sheeran', 'Lyricist': 'Ed Sheeran', 'Composer': 'Ed Sheeran', 'Album': 'Divide', 'Duration': '3:53'},
        {'SongName': 'Ae Dil Hai Mushkil', 'Language': 'Hindi', 'Genre': 'Romantic', 'Artist': 'Arijit Singh', 'Lyricist': 'Amitabh Bhattacharya', 'Composer': 'Pritam', 'Album': 'Ae Dil Hai Mushkil', 'Duration': '4:29'},
        {'SongName': 'Dil Diyan Gallan', 'Language': 'Hindi', 'Genre': 'Romantic', 'Artist': 'Atif Aslam', 'Lyricist': 'Irshad Kamil', 'Composer': 'Vishal-Shekhar', 'Album': 'Tiger Zinda Hai', 'Duration': '4:21'},
        {'SongName': 'Nashe Si Chadh Gayi', 'Language': 'Hindi', 'Genre': 'Party', 'Artist': 'Arijit Singh', 'Lyricist': 'Jaideep Sahni', 'Composer': 'Vishal-Shekhar', 'Album': 'Befikre', 'Duration': '3:57'},
        {'SongName': 'Tareefan', 'Language': 'Hindi', 'Genre': 'Pop', 'Artist': 'Badshah', 'Lyricist': 'Qaran', 'Composer': 'Qaran', 'Album': 'Veere Di Wedding', 'Duration': '3:05'},
        {'SongName': 'Tera Ban Jaunga', 'Language': 'Hindi', 'Genre': 'Romantic', 'Artist': 'Akhil Sachdeva, Tulsi Kumar', 'Lyricist': 'Kumaar', 'Composer': 'Akhil Sachdeva', 'Album': 'Kabir Singh', 'Duration': '3:57'} 
    ]

    for song_data in songs_data:
        song_songs_table = Songs(**song_data)
        song_songs_final_table = SongsFinal(**song_data)
        db.session.add(song_songs_table)
        db.session.add(song_songs_final_table)

    db.session.commit()
    
@app.route('/songs/<song_title>', methods=['GET'])
def get_song(song_title):
    try:
        song = Songs.query.filter_by(SongName=song_title).first()
        if song:
            song_data = {
                'SongName': song.SongName,
                'Language': song.Language,
                'Genre': song.Genre,
                'Artist': song.Artist,
                'Lyricist': song.Lyricist,
                'Composer': song.Composer,
                'Album': song.Album,
                'Duration': song.Duration,
                "SongId": song.SongId
            }
            return jsonify({'song': song_data})
        else:
            return jsonify({'error': 'Song not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

def drop_songs_table():
    with app.app_context():
        SongsFinal.__table__.drop(db.engine)
        
def create_tables():
    with app.app_context():
        db.create_all()
        insert_data()
        create_triggers()
        result = create_stored_procedures()
        if 'error' in result:
            return jsonify(result), 500
        else:
            return jsonify(result)

if __name__ == '__main__':
    drop_songs_table() 
    create_tables() 
    app.run(debug=True)
