"use client";
import { useState } from "react";
import { EditorWrapper } from "@/components/custom/editor/editor-wrapper";
import type { TSummary } from "@/types";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/custom/submit-button";
import { DeleteButton } from "@/components/custom/delete-button";

interface ISummaryUpdateFormProps {
  summary: TSummary;
}

const styles = {
  container: "flex flex-col px-2 py-0.5 relative",
  titleInput: "mb-3",
  editor: "h-[calc(100vh-215px)] overflow-y-auto",
  buttonContainer: "mt-3",
  updateButton: "inline-block",
  deleteFormContainer: "absolute bottom-0 right-2",
  deleteButton: "bg-pink-500 hover:bg-pink-600"
};

export function SummaryUpdateForm({ summary }: ISummaryUpdateFormProps) {
  const [content, setContent] = useState(summary.content);

  return (
    <div className={styles.container}>
      <form>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder={"Title"}
          defaultValue={summary.title || ""}
          className={styles.titleInput}
        />

        <input type="hidden" name="content" value={content} />

        <div>
          <EditorWrapper
            markdown={summary.content}
            onChange={setContent}
            className={styles.editor}
          />
        </div>

        <div className={styles.buttonContainer}>
          <div className={styles.updateButton}>
            <SubmitButton
              text="Update Summary"
              loadingText="Updating Summary"
            />
          </div>
        </div>
      </form>

      <div className={styles.deleteFormContainer}>
        <form onSubmit={() => console.log("DELETE FORM SUBMITTED")}>
          <DeleteButton className={styles.deleteButton} />
        </form>
      </div>
    </div>
  );
}
