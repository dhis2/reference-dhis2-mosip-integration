// import i18n from '@dhis2/d2-i18n'
import React, { FC } from 'react'
import { HashRouter, Routes, Route, Outlet } from 'react-router'
import classes from './App.module.css'
import { HomePage } from './plugin/HomePage'
import { RedirectHandler } from './plugin/RedirectHandler'
import { IDataEntryPluginProps } from './Plugin.types'

const Layout: FC = () => (
    <div className={classes.container}>
        <Outlet />
    </div>
)

const Plugin: FC = (pluginProps: IDataEntryPluginProps) => {
    return (
        <HashRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route
                        index
                        element={<HomePage {...pluginProps} />}
                    />
                    <Route path={'userInfo'} element={<RedirectHandler />} />
                </Route>
            </Routes>
        </HashRouter>
    )
}

export default Plugin
