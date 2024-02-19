import { ChangeEvent } from "react";
import { v4 as uuidv4 } from "uuid";

import { parser } from "./utils/parser";

interface Props {
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setSrcDoc?: React.Dispatch<React.SetStateAction<string>>;
  indexTitle?: string;
  matchIndexColor?: string;
  style?: React.CSSProperties;
  text?: string;
}

const Uploader = ({
  indexTitle,
  matchIndexColor,
  setFiles,
  setSrcDoc,
  style,
  text,
}: Props) => {
  const _modifyFileHandler = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result;

        if (typeof content === "string") {
          const parsed = parser({
            originHtmlStr: content,
            indexTitle: indexTitle,
            matchedColor: matchIndexColor,
          });

          const regex = new RegExp(
            encodeURI(file.name.replace(".html", "")),
            "g"
          );
          const removeBasePath = parsed.replace(regex, "");
          const blob = new Blob([removeBasePath], { type: "text/html" });
          const newFile = new File([blob], uuidv4() + ".html", {
            type: blob.type,
            lastModified: new Date().getTime(), // 현재 시간으로 lastModified 설정
          });

          setSrcDoc?.(parsed);
          resolve(newFile);
        }
      };

      reader.onerror = reject;

      reader.readAsText(file);
    });
  };

  const _unpackDirectory = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const newFile = new File([file], file.name, {
        type: file.type,
        lastModified: new Date().getTime(),
      });

      resolve(newFile);
    });
  };

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const _files = [];
      for (const file of e.target.files) {
        let _file = file;
        if (file.type === "text/html") {
          _file = await _modifyFileHandler(file);
        } else {
          _file = await _unpackDirectory(file);
        }
        _files.push(_file);
      }

      setFiles(_files);
    }
  };

  return (
    <>
      <label htmlFor="uploader">
        <div style={style}>{text ?? "file upload"}</div>
      </label>
      <input
        style={{ display: "none" }}
        type="file"
        name="uploader"
        id="uploader"
        onChange={onChange}
        webkitdirectory="true"
        directory="true"
        multiple
      />
    </>
  );
};

export default Uploader;
