import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    allFiles: File[] = [];
    imageFiles: File[] = [];
    videoFiles: File[] = [];
    audioFiles: File[] = [];

    imageUrl: any;
    audioUrl: any;
    videoUrl: any;

    isLabelHideen = false;
  
    constructor(
        private sanitizer: DomSanitizer
    ){
        // this.imageUrl="https://codetest1abc.s3.amazonaws.com/wallpaper-download-1.jpg";
        // this.videoUrl="https://codetest1abc.s3.amazonaws.com/a.mp4 ";
        // this.audioUrl="";
        // this.isLabelHideen = true;
    }

    onSelect(event) {

        event.addedFiles.forEach((element) => {
            // for check image type
            const regexImage = new RegExp('(.*?).(jpg|png|jpeg|svg|gif)$');
            // for check video type
            const regexVideo = new RegExp('(.*?).(mp4|3gp|ogg|wmv|flv|avi)$');
            // for check video type
            const regexAudio = new RegExp('(.*?).(mp3|oga|wav)$');

            // clear list
            this.onRemoved();

            if (regexImage.test(element.name)) {
                this.imageFiles.push(...event.addedFiles);
                this.readFile(this.imageFiles[0]).then(fileContents => {
                    // Put this string in a request body to upload it to an API.
                    this.imageUrl = fileContents;
                });
                this.isLabelHideen = true;
            } else if (regexVideo.test(element.name)) {
                this.videoFiles.push(...event.addedFiles);
                this.readFile(this.videoFiles[0]).then(fileContents => {
                    // Put this string in a request body to upload it to an API.
                    this.videoUrl = fileContents;
                });
                this.isLabelHideen = true;
            } else if(regexAudio.test(element.name)){
                this.audioFiles.push(...event.addedFiles);
                this.readFile(this.audioFiles[0]).then(fileContents => {
                    // Put this string in a request body to upload it to an API.
                    this.audioUrl = fileContents;
                    this.audioUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.audioUrl);
                });
                this.isLabelHideen = true;
            } else {
                console.log('Invalid file type');
            }

        });
    }   

    onRemoved() {
        this.imageFiles = [];
        this.videoFiles = [];
        this.audioFiles = [];
        this.videoUrl = null;
        this.audioUrl = null;
        this.imageUrl= null;
        this.isLabelHideen = false;
    }

    public async readFile(file: File): Promise<string | ArrayBuffer> {
        return new Promise<string | ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
      
          reader.onload = e => {
            return resolve((e.target as FileReader).result);
          };
      
          reader.onerror = e => {
            console.error(`FileReader failed on file ${file.name}.`);
            return reject(null);
          };
      
          if (!file) {
            console.error('No file to read.');
            return reject(null);
          }
      
          reader.readAsDataURL(file);
        });
    }
}
