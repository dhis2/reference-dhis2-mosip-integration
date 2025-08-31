// import i18n from '@dhis2/d2-i18n'
import React, { FC } from 'react'
import { HashRouter, Routes, Route, Outlet } from 'react-router'
import classes from './App.module.css'
import { FormField } from './plugin/FormField'
import { RedirectHandler } from './plugin/RedirectHandler'
import { IDataEntryPluginProps } from './Plugin.types'
import './locales'

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
                    <Route index element={<FormField {...pluginProps} />} />
                    <Route path={'userInfo'} element={<RedirectHandler />} />
                </Route>
            </Routes>
        </HashRouter>
    )
}

export default Plugin
