"use client"
import React from "react"
import DashboardWrapper from "./components/DashboardWrapper"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <DashboardWrapper>
            {children}
        </DashboardWrapper>
    )
}

export default DashboardLayout 