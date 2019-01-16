# Angular 7 Social Login

Social login and authentication module for Angular 7 (supports Angular 4+). Supports authentication with **Google**, **Facebook** and **Vkontakte**. Can be extended to other providers also.

### Original: [https://github.com/abacritt/angularx-social-login](https://github.com/abacritt/angularx-social-login)

Check out the [demo](https://abacritt.github.io/angularx-social-login/).

## Getting started

### Install via npm 

```sh
npm install --save angularx-social-login-vk
```

### Import the module

In your `AppModule`, import the `SocialLoginModule`

```javascript
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login-vk";
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider} from "angularx-social-login-vk";


let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("Google-OAuth-Client-Id")
  },
  {
    id: VkontakteLoginProvider.PROVIDER_ID,
    provider: new VkontakteLoginProvider('Vkontakte-App-Id') // ID приложения в Вконтакте
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...
    SocialLoginModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [...]
})
export class AppModule { }
```

### Sign in and out users

```javascript

import { AuthService } from "angularx-social-login-vk";
import { FacebookLoginProvider, GoogleLoginProvider, LinkedInLoginProvider } from "angularx-social-login-vk";


@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  constructor(private authService: AuthService) { }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
        .then(userData => {
          console.log('userData:', userData);
        });
  }

  signInWithVk(): void {
      this.authService.signIn(VkontakteLoginProvider.PROVIDER_ID)
        .then(userData => {
          console.log('userData:', userData);
        });
    }

  signOut(): void {
    this.authService.signOut();
  }

}
```

### Subscribe to the authentication state

You are notified when user logs in or logs out. You receive a `SocialUser` object when the user logs in and a `null` when the user logs out. `SocialUser` object contains basic user information such as name, email, photo URL, etc.

```javascript
import { AuthService } from "angularx-social-login-vk";
import { SocialUser } from "angularx-social-login-vk";

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  private user: SocialUser;
  private loggedIn: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }

}
```

### Display the user information

```html
<img src="{{ user.photoUrl }}">
<div>
  <h4>{{ user.name }}</h4>
  <p>{{ user.email }}</p>
</div>
```

## Specifying custom scope

```javascript
const fbLoginOptions: LoginOpt = {
  scope: 'pages_messaging,pages_messaging_subscriptions,email,pages_show_list,manage_pages',
  return_scopes: true,
  enable_profile_selector: true
}; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11

const googleLoginOptions: LoginOpt = {
  scope: 'profile email'
}; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("Google-OAuth-Client-Id", googleLoginOptions)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("Facebook-App-Id", fbLoginOptions)
  }
]);
```

## Building with AoT

If you are facing issue in building your app with AoT, check [this document](https://github.com/abacritt/angularx-social-login/blob/master/README-AOT.md).
