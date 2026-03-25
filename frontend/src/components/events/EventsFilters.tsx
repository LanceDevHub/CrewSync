import {
  Box,
  Field,
  Input,
  NativeSelect,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import AppButton from "../ui/AppButton";
import type { TimeRangeFilter } from "./useEvents";

type Props = {
  q: string;
  setQ: (v: string) => void;
  timeRange: TimeRangeFilter;
  setTimeRange: (v: TimeRangeFilter) => void;
  onReset: () => void;
};

export default function EventsFilters({
  q,
  setQ,
  timeRange,
  setTimeRange,
  onReset,
}: Props) {
  return (
    <Box bg="surface" p="6" borderRadius="xl" borderWidth="1px">
      <Stack gap="4">
        <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
          <Field.Root>
            <Field.Label>Suche</Field.Label>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Titel, Line-up oder Ort"
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Zeitraum</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={timeRange}
                onChange={(e) =>
                  setTimeRange(e.target.value as TimeRangeFilter)
                }
              >
                <option value="">Alle</option>
                <option value="24h">24h</option>
                <option value="1w">1 Woche</option>
                <option value="2w">2 Wochen</option>
                <option value="1m">1 Monat</option>
                <option value="3m">3 Monate</option>
                <option value="6m">6 Monate</option>
                <option value="later">später</option>
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Field.Root>
        </SimpleGrid>

        <AppButton appVariant="secondary" onClick={onReset}>
          Zurücksetzen
        </AppButton>
      </Stack>
    </Box>
  );
}
