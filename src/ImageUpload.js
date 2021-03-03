import React, {useState} from 'react';
import { Button } from '@material-ui/core';
import { storage, db } from './firebase';
import firebase from "firebase";
import './ImageUpload.css';

function ImageUpload({ username }) {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0); 
    const [caption, setCaption] = useState('');
    
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        //image name is the fileName that is being uploaded
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
           (snapshot) => {
               //progress function
               const progress = Math.round(
               (snapshot.bytesTransferred / snapshot.totalBytes) * 100
               );
               setProgress(progress);
            },
            (error) => {
                //error function
                console.log(error);
                alert(error.message);
            },
            () => {
                //Complete function
               storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then((url) => {
                    setUrl(url);
                  //post the image to DB 
                   db.collection("posts").add({
                       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                       caption: caption,
                       likes: 0,
                       imageUrl: url,
                       username: username
                   });
                   setProgress(0);
                   setCaption("");
                   setImage(null);
               });
            } 
        )
    }
    
    return (
        <div className="imageupload">
           <progress className="imageupload_progress" value={progress} max="100" />
           <input type="text" placeholder="Enter a caption ..." onChange={(event) => setCaption(event.target.value)} />
           <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
            <br />
        </div>
    )
}

export default ImageUpload
