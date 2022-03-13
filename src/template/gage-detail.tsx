import React from 'react'
import {Gage} from "../types"
import {useUserContext} from "../components/user/userContext";

type PageContext = {
    pageContext: {
        gage: Gage
    }
}

export default function GageDetail({pageContext: {gage}}: PageContext) {
    const test = useUserContext()
    return (
        <div>
            Gage detail
            {JSON.stringify(test)}
            {JSON.stringify(gage)}
        </div>
    )
}
