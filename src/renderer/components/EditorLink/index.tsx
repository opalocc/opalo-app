import React from "react";
import { createReactInlineContentSpec } from "@blocknote/react";
import { Link, useNavigate } from "react-router-dom";
 
// The Mention inline content.
export const EditorLink = createReactInlineContentSpec(
  {
    type: "internalLink",
    propSchema: {
      id: {
        default: "Unknown",
      },
      name: {
        default: "Unknown"
      }
    },
    content: "none",
  },
  {
    render: (props) => {
        const navigate = useNavigate()
      return (<span onClick={() => navigate(`/dashboard/${props.inlineContent.props.id}`)}>
        @{props.inlineContent.props.name}
      </span>)
    }
  }
);