import {BaseLoginProvider} from '../entities/base-login-provider';
import {SocialUser} from '../entities';
import {LoginOpt} from '../auth.service';

declare let VK: any;

export class VKLoginProvider extends BaseLoginProvider {

    public static readonly PROVIDER_ID = 'VK';

    constructor(
        private clientId: string
    ) {
        super();
    }

    initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.loadScript(VKLoginProvider.PROVIDER_ID,
                'https://vk.com/js/api/openapi.js?160',
                () => {
                    VK.init({
                        apiId: this.clientId
                    });

                    this._readyState.next(true);
                    resolve();
                });
        });
    }

    getLoginStatus(): Promise<SocialUser> {
        return new Promise((resolve, reject) => {
            this.onReady().then(() => {
                VK.Auth.getLoginStatus((response: any) => {

                    if (response.status === 'connected') {
                        const session = response.session;

                        let user: SocialUser = new SocialUser();
                        user.authToken = session.sid;

                        user.vk = session;

                        resolve(user);
                    }

                });
            });
        });
    }

    signIn(opt?: LoginOpt): Promise<SocialUser> {
        return new Promise((resolve, reject) => {
            this.onReady().then(() => {
                VK.Auth.login((response: any) => {

                    if (response.status === 'connected') {
                        const session = response.session;

                        let user: SocialUser = new SocialUser();
                        user.id = session.user.id;
                        user.name = session.user.first_name + ' ' + session.user.last_name;
                        user.firstName = session.user.first_name;
                        user.lastName = session.user.last_name;
                        user.authToken = session.sid;

                        user.vk = session;

                        resolve(user);
                    } else {
                        reject('User cancelled login or did not fully authorize');
                    }

                });
            });
        });
    }

    signOut(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.onReady().then(() => {
                VK.Auth.logout((response: any) => {
                    resolve();
                });
            });
        });
    }

}
