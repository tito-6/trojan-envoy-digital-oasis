
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ContentFormValues } from "../schema";
import { TabsContent } from "@/components/ui/tabs";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface FAQTabProps {
  form: UseFormReturn<ContentFormValues>;
  answerInput: string;
  handleAnswerChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const FAQTab: React.FC<FAQTabProps> = ({
  form,
  answerInput,
  handleAnswerChange,
}) => {
  return (
    <TabsContent value="faq" className="space-y-6">
      <FormField
        control={form.control}
        name="answer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Answer</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter answer" 
                rows={5}
                value={answerInput}
                onChange={handleAnswerChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </TabsContent>
  );
};
