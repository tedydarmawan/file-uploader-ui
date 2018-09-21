import { Component } from '@angular/core';
import { UploadService } from './services/upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedFile: File;
  images: any[];
  visible: boolean;

  progress: { percentage: number } = { percentage: 0 };

  constructor(private uploadService: UploadService) {}

  selectFile(event) {
    const file = event.target.files.item(0);

    if(file.type.match('image.*')) {
      this.selectedFile = file;
    }else{
      alert('Invalid format!');
    }
  }

  upload() {
    this.progress.percentage = 0;

    this.uploadService.uploadFile(this.selectedFile).subscribe(
      event => {
        if(event.type === HttpEventType.UploadProgress) {
          this.progress.percentage = Math.round(100 * event.loaded / event.total);
        }else if(event instanceof HttpResponse) {
          setTimeout(() => {
            alert('File is completely uploaded!');  
          }, 500);
        }
      }
    );

    this.selectedFile = undefined;
  }

  showImage() {
    this.visible = !this.visible;
    this.uploadService.getFiles().subscribe(
      data => {
        this.images = data
      },
      err => console.log(err),
      () => console.log("Images loaded!")
    );
  }
}
