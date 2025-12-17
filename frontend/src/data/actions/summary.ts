"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { services } from "@/data/services";

import {
  SummaryUpdateFormSchema,
  SummaryDeleteFormSchema,
  type SummaryUpdateFormState,
  type SummaryDeleteFormState
} from "@/data/validation/summary";

export async function updateSummaryAction(
  prevState: SummaryUpdateFormState,
  formData: FormData
): Promise<SummaryUpdateFormState> {
  const fields = Object.fromEntries(formData);

  const validatedFields = SummaryUpdateFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    return {
      success: false,
      message: "Validation failed",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: {
        ...prevState.data,
        ...fields
      }
    };
  }

  const { documentId, ...updateData } = validatedFields.data;

  try {
    const responseData = await services.summarize.updateSummaryService(
      documentId,
      updateData
    );

    if (responseData.error) {
      return {
        success: false,
        message: "Failed to update summary.",
        strapiErrors: responseData.error,
        zodErrors: null,
        data: {
          ...prevState.data,
          ...fields
        }
      };
    }

    // Revalidate the current page and summaries list to show updated data
    revalidatePath(`/dashboard/summaries/${documentId}`);
    revalidatePath("/dashboard/summaries");

    return {
      success: true,
      message: "Summary updated successfully!",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields
      }
    };
  } catch (error) {
    console.error("Failed to update summary:", error);
    return {
      success: false,
      message: "Failed to update summary. Please try again.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields
      }
    };
  }
}

export async function deleteSummaryAction(
  prevState: SummaryDeleteFormState,
  formData: FormData
): Promise<SummaryDeleteFormState> {
  const fields = Object.fromEntries(formData);

  const validatedFields = SummaryDeleteFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    return {
      success: false,
      message: "Validation failed",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: {
        ...prevState.data,
        ...fields
      }
    };
  }

  try {
    const responseData = await services.summarize.deleteSummaryService(
      validatedFields.data.documentId
    );

    if (responseData.error) {
      return {
        success: false,
        message: "Failed to delete summary.",
        strapiErrors: responseData.error,
        zodErrors: null,
        data: {
          ...prevState.data,
          ...fields
        }
      };
    }

    // If we get here, deletion was successful
    revalidatePath("/dashboard/summaries");
  } catch (error) {
    console.error("Failed to delete summary:", error);
    return {
      success: false,
      message: "Failed to delete summary. Please try again.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields
      }
    };
  }

  // Redirect after successful deletion (outside try/catch)
  redirect("/dashboard/summaries");
}
