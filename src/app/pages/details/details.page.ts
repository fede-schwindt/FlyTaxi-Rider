import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AvatarService } from 'src/app/services/avatar.service';
import { OverlayService } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  form: FormGroup;

  constructor(
    private overlay: OverlayService, private authy: Auth, private auth: AuthService, private avatar: AvatarService, private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      fullname: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(200)]
      }),
      lastname: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(200)]
      }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(200)]
      }),
    });
  }
  
  async signIn() {
    try {
      if(!this.form.valid) {
        this.form.markAllAsTouched();
        return;
      }
      this.overlay.showLoader("");
      this.authy.onAuthStateChanged(async (user)=>{
      const result = await this.avatar.createUser(this.form.value.fullname + '' + this.form.value.lastname, this.form.value.email, '', user.phoneNumber, user.uid)
     
      if (!result) {
        this.overlay.showAlert('Upload failed','There was a problem uploading your avatar.')
      }else{
        await this.avatar.createCard('Cash', 0, 'cash', 'None')
        this.overlay.hideLoader();
        this.router.navigateByUrl('home');
       
      }
      console.log("Uploaded");
    })
    } catch(e) {
      console.log(e);
    }
  }
}
