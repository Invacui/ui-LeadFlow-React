import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDropzone } from "@/components/common/FileDropzone";
import { useUploadLead } from "@/hooks/leads/useUploadLead";
import { validationRules, type UploadLeadFormValues } from "@/lib/validationRules";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface LeadUploadFormProps {
  onSuccess?: (id: string) => void;
  className?: string;
}

export function LeadUploadForm({ onSuccess, className }: LeadUploadFormProps) {
  const navigate = useNavigate();
  const { mutate, isPending } = useUploadLead();
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UploadLeadFormValues>();

  const handleFile = useCallback(
    (f: File) => {
      setFile(f);
      setValue("file", f);
    },
    [setValue]
  );

  const onSubmit = (values: UploadLeadFormValues) => {
    const fd = new FormData();
    fd.append("name", values.name);
    fd.append("file", values.file);
    mutate(fd, {
      onSuccess: (res) => {
        const id = res.data.data.id;
        onSuccess ? onSuccess(id) : navigate(ROUTES.lead(id));
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)}>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          List name
        </label>
        <Input
          id="name"
          placeholder="e.g. Q1 Prospects"
          {...register("name", validationRules.leadListName)}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">File (CSV or XLSX)</label>
        <FileDropzone
          onFile={handleFile}
          file={file}
          accept={{
            "text/csv": [".csv"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
          }}
        />
        <input type="file" className="hidden" {...register("file", validationRules.file)} />
        {errors.file && <p className="text-sm text-destructive">{errors.file.message as string}</p>}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Uploading…" : "Upload leads"}
      </Button>
    </form>
  );
}
