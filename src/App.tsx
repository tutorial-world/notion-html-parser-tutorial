import { FormEvent, useState } from "react";
import JSZip from "jszip";

import Uploader from "./Uploader";

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [srcDoc, setSrcDoc] = useState("");

  async function downloadFilesAsZip(files: File[]) {
    const zip = new JSZip();

    // 파일들을 zip에 추가
    files.forEach((file) => {
      zip.file(file.name, file);
    });

    // zip 파일 생성
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // zip 파일 다운로드
    const downloadUrl = URL.createObjectURL(zipBlob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = "files.zip"; // 다운로드될 zip 파일의 이름
    document.body.appendChild(anchor);
    anchor.click();

    // 사용한 URL과 앵커 요소 정리
    URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(anchor);
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files) return;
    for (const file of files) {
      console.log(file);
    }
    downloadFilesAsZip(files);
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
        <button
          type="submit"
          style={{
            marginTop: "5px",
            cursor: "pointer",
            border: "none",
            display: "flex",
            alignItems: "center",
            height: "40px",
            padding: "0 10px",
            backgroundColor: "#315697",
            width: "fit-content",
            borderRadius: "0.375rem",
            color: "#ffff",
          }}
        >
          다운로드
        </button>
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
