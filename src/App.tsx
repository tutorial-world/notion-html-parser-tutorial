import { FormEvent, useState } from "react";
import Uploader from "./Uploader";

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [srcDoc, setSrcDoc] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files) return;
    for (const file of files) {
      console.log(file);
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Uploader
          setFiles={setFiles}
          setSrcDoc={setSrcDoc}
          indexTitle="목차"
          matchIndexColor="rgb(237, 68, 66)"
          text="폴더 업로드"
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            height: "40px",
            padding: "0 10px",
            backgroundColor: "#319795",
            width: "fit-content",
            borderRadius: "0.375rem",
            color: "#ffff",
          }}
        />
      </form>
      <div style={{ margin: "100px auto 0", width: "90%", height: "70%" }}>
        <h3>Preview</h3>
        <iframe
          srcDoc={srcDoc}
          style={{
            border: "1px solid black",
            width: "100%",
            height: "100%",
            marginTop: "5px",
          }}
        />
      </div>
    </>
  );
}

export default App;
