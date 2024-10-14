import React from 'react'
import Markdown from 'react-markdown'

const markdown = '# Hi, *Pluto*!'

export const MD = (props: any) => <Markdown>{props.md || markdown}</Markdown>