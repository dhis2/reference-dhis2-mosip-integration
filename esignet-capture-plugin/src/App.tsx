// import i18n from '@dhis2/d2-i18n'
import React, { FC } from 'react'
import { HashRouter, Routes, Route, Outlet } from 'react-router'
import classes from './App.module.css'
import { LoginButton } from './LoginButton'
import { UserInfo } from './UserInfo'

const Layout: FC = () => (
    <div className={classes.container}>
        <Outlet />
    </div>
)

const MyApp: FC = () => {
    return (
        <HashRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<LoginButton />} />
                    <Route path={'userInfo'} element={<UserInfo />} />
                </Route>
            </Routes>
        </HashRouter>
    )
}

export default MyApp
