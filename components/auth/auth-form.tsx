import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
};

type AuthFormProps = {
  fields: Field[];
  submitLabel: string;
};

export function AuthForm({ fields, submitLabel }: AuthFormProps) {
  return (
    <form className="space-y-5">
      {fields.map((field) => (
        <label key={field.name} className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">{field.label}</span>
          <Input name={field.name} type={field.type ?? "text"} placeholder={field.placeholder} />
        </label>
      ))}
      <Button className="w-full" type="submit">
        {submitLabel}
      </Button>
    </form>
  );
}