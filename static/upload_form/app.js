import React, { useState } from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import { createRoot } from "https://esm.sh/react-dom/client";

import { JsonForms } from "https://esm.sh/@jsonforms/react";
import { materialRenderers } from "https://esm.sh/@jsonforms/material-renderers";

async function loadJson(path) {
    const response = await fetch(path);
    return await response.json();
}

function App() {
    const [schema, setSchema] = React.useState(null);
    const [uischema, setUiSchema] = React.useState(null);
    const [data, setData] = React.useState({});
    const [files, setFiles] = React.useState([]);

    React.useEffect(() => {
        async function init() {
        setSchema(await loadJson("/static/upload_form/upload_form_schema.json"));
        setUiSchema(await loadJson("/static/upload_form/upload_ui_schema.json"));
        }

        init();
    }, []);

    async function submitForm() {
        const formData = new FormData();

        formData.append("metadata", JSON.stringify(data));

        for (const file of files) {
        formData.append("files", file, file.webkitRelativePath || file.name);
        }

        const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData
        });

        const result = await response.json();

        alert(JSON.stringify(result, null, 2));
    }

    if (!schema || !uischema) {
        return React.createElement("div", null, "Loading...");
    }

    return React.createElement("div", null,
        React.createElement(JsonForms, {
        schema,
        uischema,
        data,
        renderers: materialRenderers,
        onChange: ({ data }) => setData(data)
        }),

        React.createElement("hr"),

        React.createElement("input", {
        type: "file",
        multiple: true,
        webkitdirectory: true,
        onChange: (e) => setFiles(Array.from(e.target.files))
        }),

        React.createElement("button", {
        onClick: submitForm
        }, "Submit")
    );
}

const root = createRoot(document.getElementById("app"));

root.render(React.createElement(App));