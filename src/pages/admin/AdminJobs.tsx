
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  Plus, 
  Search, 
  Filter,
  ArrowUpDown,
  Briefcase,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storageService } from "@/lib/storage";
import { JobOpening } from "@/lib/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  title: z.string().min(2, { message: "Job title must be at least 2 characters" }),
  department: z.string().min(2, { message: "Department is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  type: z.enum(["Full-time", "Part-time", "Contract", "Remote"]),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  responsibilities: z.string().min(10, { message: "Responsibilities must be at least 10 characters" }),
  requirements: z.string().min(10, { message: "Requirements must be at least 10 characters" }),
  benefits: z.string().optional(),
  minSalary: z.string().optional(),
  maxSalary: z.string().optional(),
  currency: z.string().optional(),
  applicationUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal("")),
  published: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

const AdminJobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [isNewJobDialogOpen, setIsNewJobDialogOpen] = useState(false);
  const [isEditJobDialogOpen, setIsEditJobDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<JobOpening | null>(null);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [sortField, setSortField] = useState<keyof JobOpening>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      description: "",
      responsibilities: "",
      requirements: "",
      benefits: "",
      minSalary: "",
      maxSalary: "",
      currency: "USD",
      applicationUrl: "",
      published: false,
    },
  });
  
  const editForm = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      description: "",
      responsibilities: "",
      requirements: "",
      benefits: "",
      minSalary: "",
      maxSalary: "",
      currency: "USD",
      applicationUrl: "",
      published: false,
    },
  });
  
  useEffect(() => {
    loadJobs();
  }, []);
  
  useEffect(() => {
    if (itemToEdit) {
      editForm.reset({
        title: itemToEdit.title,
        department: itemToEdit.department,
        location: itemToEdit.location,
        type: itemToEdit.type,
        description: itemToEdit.description,
        responsibilities: itemToEdit.responsibilities.join('\n'),
        requirements: itemToEdit.requirements.join('\n'),
        benefits: itemToEdit.benefits?.join('\n') || "",
        minSalary: itemToEdit.salary?.min?.toString() || "",
        maxSalary: itemToEdit.salary?.max?.toString() || "",
        currency: itemToEdit.salary?.currency || "USD",
        applicationUrl: itemToEdit.applicationUrl || "",
        published: itemToEdit.published,
      });
    }
  }, [itemToEdit]);
  
  const loadJobs = () => {
    const jobs = storageService.getAllJobOpenings ? storageService.getAllJobOpenings() : [];
    setJobOpenings(jobs);
  };
  
  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? job.type === selectedType : true;
    const matchesDepartment = selectedDepartment ? job.department === selectedDepartment : true;
    
    return matchesSearch && matchesType && matchesDepartment;
  });
  
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    const aNum = aValue || 0;
    const bNum = bValue || 0;
    
    return sortDirection === 'asc' ? +aNum - +bNum : +bNum - +aNum;
  });
  
  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote"];
  const departments = Array.from(new Set(jobOpenings.map(job => job.department)));
  
  const handleSortChange = (field: keyof JobOpening) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const onSubmit = async (data: FormData) => {
    try {
      const responsibilities = data.responsibilities.split('\n').filter(item => item.trim() !== '');
      const requirements = data.requirements.split('\n').filter(item => item.trim() !== '');
      const benefits = data.benefits ? data.benefits.split('\n').filter(item => item.trim() !== '') : undefined;
      
      const salary = (data.minSalary || data.maxSalary) ? {
        min: data.minSalary ? parseInt(data.minSalary) : undefined,
        max: data.maxSalary ? parseInt(data.maxSalary) : undefined,
        currency: data.currency || 'USD'
      } : undefined;
      
      const newJob = storageService.addJobOpening({
        title: data.title,
        department: data.department,
        location: data.location,
        type: data.type,
        description: data.description,
        responsibilities,
        requirements,
        benefits,
        salary,
        applicationUrl: data.applicationUrl || undefined,
        published: data.published,
      });
      
      if (newJob) {
        toast({
          title: "Job opening created",
          description: `${data.title} has been added successfully.`,
        });
        
        loadJobs();
        setIsNewJobDialogOpen(false);
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Error creating job opening",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const onEdit = async (data: FormData) => {
    if (!itemToEdit) return;
    
    try {
      const responsibilities = data.responsibilities.split('\n').filter(item => item.trim() !== '');
      const requirements = data.requirements.split('\n').filter(item => item.trim() !== '');
      const benefits = data.benefits ? data.benefits.split('\n').filter(item => item.trim() !== '') : undefined;
      
      const salary = (data.minSalary || data.maxSalary) ? {
        min: data.minSalary ? parseInt(data.minSalary) : undefined,
        max: data.maxSalary ? parseInt(data.maxSalary) : undefined,
        currency: data.currency || 'USD'
      } : undefined;
      
      const success = storageService.updateJobOpening(itemToEdit.id, {
        title: data.title,
        department: data.department,
        location: data.location,
        type: data.type,
        description: data.description,
        responsibilities,
        requirements,
        benefits,
        salary,
        applicationUrl: data.applicationUrl || undefined,
        published: data.published,
      });
      
      if (success) {
        toast({
          title: "Job opening updated",
          description: `${data.title} has been updated successfully.`,
        });
        
        loadJobs();
        setIsEditJobDialogOpen(false);
        setItemToEdit(null);
      }
    } catch (error) {
      toast({
        title: "Error updating job opening",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleEdit = (job: JobOpening) => {
    setItemToEdit(job);
    setIsEditJobDialogOpen(true);
  };
  
  const confirmDelete = (id: number) => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = () => {
    if (itemToDelete) {
      const job = jobOpenings.find(job => job.id === itemToDelete);
      const success = storageService.deleteJobOpening(itemToDelete);
      
      if (success) {
        toast({
          title: "Job opening deleted",
          description: `"${job?.title}" has been removed.`,
        });
        
        loadJobs();
      }
      
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };
  
  const getStatusBadge = (published: boolean) => {
    if (published) {
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Published</span>
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Clock className="w-3.5 h-3.5" />
        <span>Draft</span>
      </Badge>
    );
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-display font-bold">Job Openings</h1>
          
          <Button onClick={() => setIsNewJobDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Job
          </Button>
        </div>
        
        <div className="bg-card border border-border rounded-lg shadow-sm">
          <div className="p-4 border-b border-border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative">
                  <select
                    className="w-full md:w-48 px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none pl-4 pr-10"
                    value={selectedType || ""}
                    onChange={(e) => setSelectedType(e.target.value || null)}
                  >
                    <option value="">All Types</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                </div>
                
                <div className="relative">
                  <select
                    className="w-full md:w-48 px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none pl-4 pr-10"
                    value={selectedDepartment || ""}
                    onChange={(e) => setSelectedDepartment(e.target.value || null)}
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('id')}>
                      <span>ID</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('title')}>
                      <span>TITLE</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('department')}>
                      <span>DEPARTMENT</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('location')}>
                      <span>LOCATION</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('type')}>
                      <span>TYPE</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('published')}>
                      <span>STATUS</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortChange('updatedAt')}>
                      <span>UPDATED</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedJobs.length > 0 ? (
                  sortedJobs.map((job) => (
                    <tr key={job.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                      <td className="py-3 px-4 text-sm">{job.id}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-primary" />
                          <span className="font-medium">{job.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{job.department}</td>
                      <td className="py-3 px-4 text-sm">{job.location}</td>
                      <td className="py-3 px-4 text-sm">
                        <Badge variant="secondary">{job.type}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {getStatusBadge(job.published)}
                      </td>
                      <td className="py-3 px-4 text-sm">{job.updatedAt}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEdit(job)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={() => confirmDelete(job.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      {jobOpenings.length === 0 ? (
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="w-8 h-8 text-muted-foreground/60" />
                          <p>No job openings found. Click "Add New Job" to create one.</p>
                        </div>
                      ) : (
                        "No job openings match your search criteria"
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredJobs.length} of {jobOpenings.length} job openings
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={jobOpenings.length <= 10}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={jobOpenings.length <= 10}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* New Job Dialog */}
      <Dialog open={isNewJobDialogOpen} onOpenChange={setIsNewJobDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Job Opening</DialogTitle>
            <DialogDescription>
              Create a new job opening to be displayed on your website
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Senior Software Engineer" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Textarea rows={4} placeholder="Enter a detailed job description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="responsibilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsibilities</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={5} 
                          placeholder="Enter each responsibility on a new line..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>Enter each item on a new line</FormDescription>
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
                          rows={5} 
                          placeholder="Enter each requirement on a new line..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>Enter each item on a new line</FormDescription>
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
                        rows={4} 
                        placeholder="Enter each benefit on a new line..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>Enter each item on a new line</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="minSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Salary (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="50000" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Salary (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="90000" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="JPY">JPY (¥)</SelectItem>
                          <SelectItem value="CAD">CAD ($)</SelectItem>
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
                      <Input placeholder="https://careers.yourcompany.com/apply" {...field} />
                    </FormControl>
                    <FormDescription>If left empty, applicants will be directed to the default contact form</FormDescription>
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
                      <FormLabel className="text-base">Publish Job</FormLabel>
                      <FormDescription>
                        Make this job opening visible on your website
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
                  onClick={() => setIsNewJobDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Job Opening</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={isEditJobDialogOpen} onOpenChange={setIsEditJobDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job Opening</DialogTitle>
            <DialogDescription>
              Update job opening details
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEdit)} className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Senior Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
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
                
                <FormField
                  control={editForm.control}
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
                  control={editForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="Enter a detailed job description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={editForm.control}
                  name="responsibilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsibilities</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={5} 
                          placeholder="Enter each responsibility on a new line..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>Enter each item on a new line</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={5} 
                          placeholder="Enter each requirement on a new line..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>Enter each item on a new line</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="benefits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Benefits (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={4} 
                        placeholder="Enter each benefit on a new line..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>Enter each item on a new line</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={editForm.control}
                  name="minSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Salary (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="50000" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="maxSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Salary (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="90000" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="JPY">JPY (¥)</SelectItem>
                          <SelectItem value="CAD">CAD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="applicationUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://careers.yourcompany.com/apply" {...field} />
                    </FormControl>
                    <FormDescription>If left empty, applicants will be directed to the default contact form</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Publish Job</FormLabel>
                      <FormDescription>
                        Make this job opening visible on your website
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
                  onClick={() => {
                    setIsEditJobDialogOpen(false);
                    setItemToEdit(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Job Opening</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this job opening? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminJobs;
