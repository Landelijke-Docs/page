import { useEffect, useState } from "react";

import { JsonForms } from "@jsonforms/react";
import {
    materialRenderers,
    materialCells
} from "@jsonforms/material-renderers";

export default function App() {
    const [schema, setSchema] = useState(null);
    const [uischema, setUiSchema] = useState(null);

    const [data, setData] = useState({});
    const [files, setFiles] = useState([]);

    useEffect(() => {
        async function loadSchemas() {
        const schemaResponse =
            await fetch("./upload_form_schema.json");

        const uiSchemaResponse =
            await fetch("./upload_ui_schema.json");

        const schemaJson =
            await schemaResponse.json();

        const uiSchemaJson =
            await uiSchemaResponse.json();

        setSchema(schemaJson);
        setUiSchema(uiSchemaJson);
        }

        loadSchemas();
    }, []);

    if (!schema || !uischema) {
        return <div>Loading schemas...</div>;
    }

    async function submitForm() {
        const formData = new FormData();

        formData.append(
        "metadata",
        JSON.stringify(data)
        );

        for (const file of files) {
        formData.append(
            "files",
            file,
            file.webkitRelativePath || file.name
        );
        }

        const response = await fetch(
        "http://localhost:8000/upload",
        {
            method: "POST",
            body: formData
        }
        );

        const result = await response.json();

        console.log(result);

        alert("Upload complete");
    }

    return (
        <div style={{ padding: "2rem" }}>
        <h1>Upload Portal</h1>

        <JsonForms
            schema={schema}
            uischema={uischema}
            data={data}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={({ data }) => setData(data)}
        />

        <hr />

        <input
            type="file"
            multiple
            webkitdirectory=""
            onChange={(e) =>
            setFiles(Array.from(e.target.files))
            }
        />

        <br />
        <br />

        <button onClick={submitForm}>
            Submit Upload
        </button>
        </div>
    );
}