
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { storageService } from "@/lib/storage";
import { JobOpening } from "@/lib/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const JobFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  type: z.enum(["Full-time", "Part-time", "Contract", "Remote"]),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  responsibilities: z.string().transform(val => val.split('\n').filter(Boolean)),
  requirements: z.string().transform(val => val.split('\n').filter(Boolean)),
  benefits: z.string().transform(val => val.split('\n').filter(Boolean)).optional(),
  salaryMin: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  salaryMax: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  salaryCurrency: z.string().optional(),
  applicationUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
  published: z.boolean().default(false),
});

type JobFormValues = z.infer<typeof JobFormSchema>;

const AdminJobs: React.FC = () => {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const { toast } = useToast();

  const addForm = useForm<JobFormValues>({
    resolver: zodResolver(JobFormSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      description: "",
      responsibilities: "",
      requirements: "",
      benefits: "",
      salaryMin: "",
      salaryMax: "",
      salaryCurrency: "USD",
      applicationUrl: "",
      published: false,
    },
  });

  const editForm = useForm<JobFormValues>({
    resolver: zodResolver(JobFormSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      type: "Full-time", 
      description: "",
      responsibilities: "",
      requirements: "",
      benefits: "",
      salaryMin: "",
      salaryMax: "",
      salaryCurrency: "USD",
      applicationUrl: "",
      published: false,
    },
  });

  useEffect(() => {
    loadJobs();
    
    // Set up event listeners for job changes
    const addedListener = storageService.addEventListener('job-added', () => {
      loadJobs();
    });
    
    const updatedListener = storageService.addEventListener('job-updated', () => {
      loadJobs();
    });
    
    const deletedListener = storageService.addEventListener('job-deleted', () => {
      loadJobs();
    });
    
    return () => {
      addedListener();
      updatedListener();
      deletedListener();
    };
  }, []);

  useEffect(() => {
    if (selectedJob && isEditDialogOpen) {
      editForm.reset({
        title: selectedJob.title,
        department: selectedJob.department,
        location: selectedJob.location,
        type: selectedJob.type,
        description: selectedJob.description,
        responsibilities: selectedJob.responsibilities.join('\n'),
        requirements: selectedJob.requirements.join('\n'),
        benefits: selectedJob.benefits?.join('\n') || '',
        salaryMin: selectedJob.salary?.min?.toString() || '',
        salaryMax: selectedJob.salary?.max?.toString() || '',
        salaryCurrency: selectedJob.salary?.currency || 'USD',
        applicationUrl: selectedJob.applicationUrl || '',
        published: selectedJob.published,
      });
    }
  }, [selectedJob, isEditDialogOpen]);

  const loadJobs = () => {
    const jobsData = storageService.getAllJobOpenings();
    setJobs(jobsData);
  };

  const handleAddSubmit = (data: JobFormValues) => {
    try {
      const newJob: Omit<JobOpening, 'id' | 'createdAt' | 'updatedAt'> = {
        title: data.title,
        department: data.department,
        location: data.location,
        type: data.type,
        description: data.description,
        responsibilities: data.responsibilities as string[],
        requirements: data.requirements as string[],
        benefits: data.benefits as string[] || [],
        salary: {
          min: data.salaryMin ? Number(data.salaryMin) : undefined,
          max: data.salaryMax ? Number(data.salaryMax) : undefined,
          currency: data.salaryCurrency
        },
        applicationUrl: data.applicationUrl || undefined,
        published: data.published,
      };
      
      storageService.addJobOpening(newJob);
      
      toast({
        title: "Job Opening Created",
        description: "The job has been successfully added.",
      });
      
      addForm.reset();
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job opening. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = (data: JobFormValues) => {
    if (!selectedJob) return;
    
    try {
      const updatedJob: Partial<Omit<JobOpening, 'id' | 'createdAt' | 'updatedAt'>> = {
        title: data.title,
        department: data.department,
        location: data.location,
        type: data.type,
        description: data.description,
        responsibilities: data.responsibilities as string[],
        requirements: data.requirements as string[],
        benefits: data.benefits as string[] || [],
        salary: {
          min: data.salaryMin ? Number(data.salaryMin) : undefined,
          max: data.salaryMax ? Number(data.salaryMax) : undefined,
          currency: data.salaryCurrency || 'USD'
        },
        applicationUrl: data.applicationUrl || undefined,
        published: data.published,
      };
      
      storageService.updateJobOpening(selectedJob.id, updatedJob);
      
      toast({
        title: "Job Opening Updated",
        description: "The job has been successfully updated.",
      });
      
      editForm.reset();
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job opening. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (!selectedJob) return;
    
    try {
      storageService.deleteJobOpening(selectedJob.id);
      
      toast({
        title: "Job Opening Deleted",
        description: "The job has been successfully deleted.",
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job opening. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderJobForm = (form: any, onSubmit: any, isEdit = false) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Frontend Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="Engineering" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="New York, NY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type</FormLabel>
                <Select 
                  defaultValue={field.value} 
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detailed description of the job role" 
                  {...field} 
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="responsibilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsibilities</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="One responsibility per line" 
                    {...field} 
                    rows={4}
                  />
                </FormControl>
                <FormDescription>
                  Enter each responsibility on a new line
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requirements</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="One requirement per line" 
                    {...field} 
                    rows={4}
                  />
                </FormControl>
                <FormDescription>
                  Enter each requirement on a new line
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="benefits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Benefits (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="One benefit per line" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Enter each benefit on a new line
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="salaryMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Salary (Optional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="50000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="salaryMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Salary (Optional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="80000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="salaryCurrency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select 
                  defaultValue={field.value} 
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="AUD">AUD</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="applicationUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application URL (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/apply" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                URL where applicants can apply for this job
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Publish Job Opening</FormLabel>
                <FormDescription>
                  Make this job visible on the website
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => isEdit ? setIsEditDialogOpen(false) : setIsAddDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? "Update Job" : "Create Job"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Job Openings</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Job Opening</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new job opening.
                </DialogDescription>
              </DialogHeader>
              {renderJobForm(addForm, handleAddSubmit)}
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Manage Job Openings</CardTitle>
            <CardDescription>
              View, edit, and delete job postings on your website.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No job openings found. Create your first job posting.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.department}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>{job.type}</TableCell>
                        <TableCell>
                          {job.published ? (
                            <Badge variant="default" className="bg-green-500">Published</Badge>
                          ) : (
                            <Badge variant="outline">Draft</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedJob(job);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive"
                              onClick={() => {
                                setSelectedJob(job);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Edit Job Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Job Opening</DialogTitle>
              <DialogDescription>
                Update the details for this job opening.
              </DialogDescription>
            </DialogHeader>
            {renderJobForm(editForm, handleEditSubmit, true)}
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the job opening "{selectedJob?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminJobs;
