import { Field, Input, Stack, Textarea } from "@chakra-ui/react";

type EventFormFieldsProps = {
  title: string;
  lineup: string;
  officialLink: string;
  location: string;
  startDatetime: string;
  endDatetime: string;
  onTitleChange: (value: string) => void;
  onLineupChange: (value: string) => void;
  onOfficialLinkChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onStartDatetimeChange: (value: string) => void;
  onEndDatetimeChange: (value: string) => void;
};

export default function EventFormFields({
  title,
  lineup,
  officialLink,
  location,
  startDatetime,
  endDatetime,
  onTitleChange,
  onLineupChange,
  onOfficialLinkChange,
  onLocationChange,
  onStartDatetimeChange,
  onEndDatetimeChange,
}: EventFormFieldsProps) {
  return (
    <Stack gap="4">
      <Field.Root required>
        <Field.Label>Titel</Field.Label>
        <Input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          color="text"
          bg="surface"
          borderColor="border"
          _placeholder={{ color: "textMuted" }}
          _focusVisible={{ borderColor: "brandAccent" }}
        />
      </Field.Root>

      <Field.Root required>
        <Field.Label>Interpreten / Line-up</Field.Label>
        <Textarea
          placeholder="Ein Name pro Zeile"
          value={lineup}
          onChange={(event) => onLineupChange(event.target.value)}
          color="text"
          bg="surface"
          borderColor="border"
          _placeholder={{ color: "textMuted" }}
          _focusVisible={{ borderColor: "brandAccent" }}
        />
      </Field.Root>

      <Field.Root>
        <Field.Label>Offizielle Eventseite (optional)</Field.Label>
        <Input
          type="text"
          placeholder="z. B. www.eventseite.de"
          value={officialLink}
          onChange={(event) => onOfficialLinkChange(event.target.value)}
          color="text"
          bg="surface"
          borderColor="border"
          _placeholder={{ color: "textMuted" }}
          _focusVisible={{ borderColor: "brandAccent" }}
        />
      </Field.Root>

      <Field.Root required>
        <Field.Label>Ort</Field.Label>
        <Input
          value={location}
          onChange={(event) => onLocationChange(event.target.value)}
          color="text"
          bg="surface"
          borderColor="border"
          _placeholder={{ color: "textMuted" }}
          _focusVisible={{ borderColor: "brandAccent" }}
        />
      </Field.Root>

      <Field.Root required>
        <Field.Label>Beginn</Field.Label>
        <Input
          type="datetime-local"
          value={startDatetime}
          onChange={(event) => onStartDatetimeChange(event.target.value)}
          color="text"
          bg="surface"
          borderColor="border"
          _focusVisible={{ borderColor: "brandAccent" }}
        />
      </Field.Root>

      <Field.Root>
        <Field.Label>Ende (optional)</Field.Label>
        <Input
          type="datetime-local"
          value={endDatetime}
          onChange={(event) => onEndDatetimeChange(event.target.value)}
          color="text"
          bg="surface"
          borderColor="border"
          _focusVisible={{ borderColor: "brandAccent" }}
        />
      </Field.Root>
    </Stack>
  );
}
