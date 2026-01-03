"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimePickerProps {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    className?: string;
    required?: boolean;
    name?: string;
}

export function DateTimePicker({
    value,
    onChange,
    className,
    required,
    name,
}: DateTimePickerProps) {
    const [date, setDate] = React.useState<Date | undefined>(value || new Date());
    const [time, setTime] = React.useState<string>(
        value
            ? format(value, "HH:mm")
            : format(new Date(), "HH:mm")
    );
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (value) {
            setDate(value);
            setTime(format(value, "HH:mm"));
        }
    }, [value]);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            const [hours, minutes] = time.split(":").map(Number);
            const newDateTime = new Date(selectedDate);
            newDateTime.setHours(hours || 0, minutes || 0, 0, 0);
            setDate(newDateTime);
            onChange?.(newDateTime);
            setOpen(false); // Close popover after selecting date
        } else {
            setDate(undefined);
            onChange?.(undefined);
        }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        setTime(newTime);
        if (date) {
            const [hours, minutes] = newTime.split(":").map(Number);
            const newDateTime = new Date(date);
            newDateTime.setHours(hours || 0, minutes || 0, 0, 0);
            setDate(newDateTime);
            onChange?.(newDateTime);
        }
    };

    // Create hidden input for form submission
    const hiddenInputValue = date
        ? format(date, "yyyy-MM-dd'T'HH:mm")
        : "";

    return (
        <div className={cn("space-y-3", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        type="button"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            <div className="space-y-2">
                <Label htmlFor={`${name}-time`} className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time
                </Label>
                <Input
                    id={`${name}-time`}
                    type="time"
                    value={time}
                    onChange={handleTimeChange}
                    className="w-full"
                />
            </div>
            <input
                type="hidden"
                name={name}
                value={hiddenInputValue}
                required={required}
            />
        </div>
    );
}

