import { ChangeEvent, FormEvent, useState } from "react";
import { parser } from "./utils/parser";

function App() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [srcDoc, setSrcDoc] = useState("");

  const modifyFileHandler = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result;

        if (typeof content === "string") {
          const parsed = parser({
            originHtmlStr: content,
            indexTitle: "목차",
            matchedColor: "rgb(237, 68, 66)",
          });
          const blob = new Blob([parsed], { type: "text/html" });
          const newFile = new File([blob], file.name, {
            type: blob.type,
            lastModified: new Date().getTime(), // 현재 시간으로 lastModified 설정
          });

          resolve(newFile);
        }
      };

      reader.onerror = reject;

      reader.readAsText(file);
    });
  };

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const _files = [];
      for (const file of e.target.files) {
        let _file = file;
        if (file.type === "text/html") {
          _file = await modifyFileHandler(file);
        }
        _files.push(_file);
      }

      setFiles(_files);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(files);

    if (!files) return;
    for (const file of files) {
      if (file.type !== "text/html") continue;

      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        if (typeof e.target?.result !== "string") return;
        setSrcDoc(e.target?.result);
      };
    }
  };

  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0 }}>
        <form onSubmit={onSubmit}>
          <input
            type="file"
            onChange={onChange}
            webkitdirectory="true"
            directory="true"
            multiple
          />
          <button type="submit">click</button>
        </form>
      </div>
      <iframe
        srcDoc={srcDoc}
        style={{ border: "none", width: "100%", height: "100%" }}
      />
    </>
  );
}

export default App;
