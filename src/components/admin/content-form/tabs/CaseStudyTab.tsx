
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ContentFormValues } from "../schema";
import { TabsContent } from "@/components/ui/tabs";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CaseStudyTabProps {
  form: UseFormReturn<ContentFormValues>;
  clientInput: string;
  durationInput: string;
  technologiesInput: string;
  challengeInput: string;
  solutionInput: string;
  resultsInput: string;
  handleClientChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDurationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTechnologiesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChallengeChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSolutionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleResultsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const CaseStudyTab: React.FC<CaseStudyTabProps> = ({
  form,
  clientInput,
  durationInput,
  technologiesInput,
  challengeInput,
  solutionInput,
  resultsInput,
  handleClientChange,
  handleDurationChange,
  handleTechnologiesChange,
  handleChallengeChange,
  handleSolutionChange,
  handleResultsChange,
}) => {
  return (
    <TabsContent value="case-study" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter client" 
                  value={clientInput}
                  onChange={handleClientChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. 3 months" 
                  value={durationInput}
                  onChange={handleDurationChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="technologies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Technologies</FormLabel>
            <FormDescription>Enter technologies separated by commas (e.g. React, Node.js, Supabase)</FormDescription>
            <FormControl>
              <Input 
                placeholder="Enter technologies" 
                value={technologiesInput}
                onChange={handleTechnologiesChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="challenge"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Challenge</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe the challenge" 
                rows={3}
                value={challengeInput}
                onChange={handleChallengeChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="solution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Solution</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe the solution" 
                rows={3}
                value={solutionInput}
                onChange={handleSolutionChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="results"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Results</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe the results" 
                rows={3}
                value={resultsInput}
                onChange={handleResultsChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </TabsContent>
  );
};
