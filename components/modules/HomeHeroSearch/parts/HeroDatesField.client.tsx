"use client";

import { SearchDateRangePicker, updateDateRange } from "@modules/PropertySearchFilters";
import type { HeroDatesFieldProps } from "@/types/components/modules/home-hero-search";
import { useState } from "react";

import _STRINGS from "@/utils/LocalStrings";
import HeroSegment from "./HeroSegment";
import Modal from "@elements/Modal";
import moment from "moment-jalaali";

const DAY_MONTH_FORMAT = "jD jMMMM";

/**
 * Check-in and check-out, in the Jalali calendar the rest of the app uses.
 *
 * The picker and its range logic are the ones `/rooms` already ships — the same
 * two-tap start/end behaviour, the same handling of tapping a chosen day to
 * clear it. Reusing them rather than writing a second date control is what keeps
 * a date chosen on the home page behaving identically to one chosen in the
 * filter panel.
 */
const HeroDatesField = ({ checkin, checkout, onChange }: HeroDatesFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasRange = !!checkin && !!checkout;

  const value = hasRange
    ? `${moment(checkin).format(DAY_MONTH_FORMAT)} - ${moment(checkout).format(DAY_MONTH_FORMAT)}`
    : !!checkin
      ? `${moment(checkin).format(DAY_MONTH_FORMAT)} - ...`
      : _STRINGS.HERO_DATES_EMPTY;

  return (
    <>
      <HeroSegment
        value={value}
        filled={!!checkin}
        label={_STRINGS.HERO_DATES_LABEL}
        onClick={() => setIsOpen(true)}
      />

      <Modal show={isOpen} onHide={() => setIsOpen(false)}>
        <SearchDateRangePicker
          selectedDates={{
            startDate: checkin ? moment(checkin).format("jYYYY/jMM/jD") : null,
            endDate: checkout ? moment(checkout).format("jYYYY/jMM/jD") : null,
          }}
          setSelectedDay={(day) =>
            updateDateRange({
              date: day,
              // Closing only once a full range exists is what makes the second
              // tap land: `updateDateRange` calls back only on the closing date.
              cb: () => setIsOpen(false),
              state: { checkin, checkout },
              setState: (updater) =>
                onChange(
                  typeof updater === "function"
                    ? updater({ checkin, checkout })
                    : updater,
                ),
            })
          }
        />
      </Modal>
    </>
  );
};

export default HeroDatesField;
