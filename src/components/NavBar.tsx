import { Component } from 'react';
import { IUser } from '../@types';
import Utils from '../utils/Utils';

interface IState {
    user: IUser;
}

export default class NavBar extends Component {
    public state: IState;

    constructor(props: { user: IUser }) {
        super(props);

        this.state = {
            user: props.user
        };
    }

    componentDidMount() {
        const dropdowns = document.querySelectorAll('[data-dropdown]');
        const user = document.querySelector('.user');

        dropdowns.forEach((dropdown) => {
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('open');
            });

            document.addEventListener('click', () => {
                dropdown.classList.remove('open');
            });
        });

        user.addEventListener('click', (e) => {
            const userMenu = document.querySelector('.user .menu');
            e.stopPropagation();

            userMenu?.classList?.toggle('open');

            document.addEventListener('click', () => {
                userMenu?.classList?.remove('open');
            });
        });
    }

    render() {
        const { user } = this.state;

        return (
            <>
                <header className={`header`}>
                    <ul>
                        <li>
                            <a href="#">
                                <i className="fas fa-home" />
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fab fa-discord" />
                            </a>
                        </li>
                        <li data-dropdown>
                            <i className="fad fa-box-alt" />
                            <span className={'text'}>Features</span>
                            <ul>
                                <li>
                                    <a href="#">
                                        <span>Feature 1</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span>Feature 2</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span>Feature 3</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>

                    <div className={'user'}>
                        {!this.state.user ? (<a href="/auth/login" className={'loginButton'}>Login</a>) : (
                            <div className={'image'}>
                                <img src={Utils.getUserAvatar(user)} />
                                <div className={'menu'}>
                                    <ul>
                                        <li>
                                            <a href={`/dashboard/@me`}>
                                                <span>Profile</span>
                                            </a>
                                        </li>
                                        
                                        <hr />

                                        <li>
                                            <a href={'/commands'}>
                                                <span>Commands</span>
                                            </a>
                                        </li>

                                        <hr />

                                        <li className={'logout'}>
                                            <a href='/auth/logout'>
                                                <span>Logout</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </header>
            </>
        );
    }
}