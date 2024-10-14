import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { gapi } from "gapi-script";
import { useParams } from 'react-router-dom';

export const MD = () =>{
    const { id } = useParams()
    const [markdown, setMarkdown] = useState('# Hi, *Pluto*!')
    useEffect(() => {
        console.log("navigated to" + id);
        
        (async () =>{
            if(!gapi.client?.drive || !id)
                return
            const response = await gapi.client.drive.files.get({
                'fileId': id,
                alt:"media"
            });
            setMarkdown(response.body)
        })()
    },[id])

  return <Markdown>{markdown}</Markdown>
} 