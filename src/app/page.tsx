"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from "react";
import {environment} from './environment';
import {fetchWithCredentials} from "@/app/fetchWithCredentials";


export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState("");
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        getUserInfo(); // 在组件挂载时调用 getUserInfo 方法
        getMessages();
    }, []);

    const getUserInfo = async () => {
        try {
            const userInfo = await fetchWithCredentials('/userinfo', {method: 'GET'});
            if (userInfo) {
                setIsAuthenticated(true);
                setUserName(userInfo.sub);
            }
        } catch (error) {
            setIsAuthenticated(false);
            console.error('Error fetching user info:', error);
        }
    };

    const getMessages = async () => {
        try {
            const messages = await fetchWithCredentials('/messages', {method: 'GET'});
            if (messages) {
                setMessages(messages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }

    };


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const login = () => {
        window.location.href = environment.backendBaseUrl;
    };

    const logout = () => {
        try {
            fetchWithCredentials('/logout', {method: 'POST'});
            setIsAuthenticated(false);
            setUserName("");
            setMessages([]);
        } catch (error) {
            console.error(error);
        }

    };

    const authorizeMessages = () => {
        window.location.href = environment.backendBaseUrl + "/oauth2/authorization/messaging-client-authorization-code";
    };

    return (
        <div>
            {/* 导航栏 */}
            <nav className="navbar navbar-expand-lg bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src="/spring-security.svg" width="40" height="32" alt="Logo"/>
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/">
                                    Home
                                </a>
                            </li>
                            {isAuthenticated && (
                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle"
                                        href="#"
                                        role="button"
                                        onClick={toggleDropdown}
                                        aria-expanded={isOpen}
                                    >
                                        Authorize
                                    </a>
                                    {isOpen && (
                                        <ul className="dropdown-menu show">
                                            <li>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={authorizeMessages} // 点击后关闭菜单
                                                >
                                                    Messages
                                                </a>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            )}
                        </ul>
                        <div className="d-flex">
                            {isAuthenticated ? (
                                <div>
                                    <span className="fs-6 px-3">{userName}</span>
                                    <button
                                        className="btn btn-outline-dark"
                                        onClick={logout}>
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <button
                                        className="btn btn-outline-dark"
                                        onClick={login}
                                    >
                                        Login
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* 消息列表显示 */}
            <div className="container">
                {messages.length > 0 && (
                    <div className="row py-5 justify-content-start">
                        <div className="col">
                            <table className="table table-striped caption-top">
                                <caption>Messages</caption>
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Message</th>
                                </tr>
                                </thead>
                                <tbody>
                                {messages.map((message, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{message}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
