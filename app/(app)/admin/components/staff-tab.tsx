import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Staff, Booking } from '../types';
import { Avatar, AvatarImage, AvatarFallback } from '@/registry/new-york-v4/ui/avatar';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Star, Calendar, Award, User, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { TabContentLayout } from '@/components/layouts/TabContentLayout';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/registry/new-york-v4/ui/table';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/registry/new-york-v4/ui/dialog';
import { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/registry/new-york-v4/ui/form';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Textarea } from '@/registry/new-york-v4/ui/textarea';
import { Checkbox } from '@/registry/new-york-v4/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/registry/new-york-v4/ui/select';
const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

interface StaffTabProps {
  staff: Staff[];
  bookings: Booking[];
}

// Utility for deep cloning
const deepClone = (obj: unknown) => JSON.parse(JSON.stringify(obj));

// Reusable dialog for create/edit staff
interface StaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStaff?: Staff | null;
  onSubmit: (data: StaffFormType) => void;
  mode: 'edit' | 'create';
}

const StaffDialog: React.FC<StaffDialogProps> = ({ open, onOpenChange, initialStaff, onSubmit, mode }) => {
  const form = useForm<StaffFormType>({
    resolver: zodResolver(staffSchema),
    defaultValues: initialStaff
      ? {
          name: initialStaff.name,
          email: initialStaff.email,
          phone: initialStaff.phone,
          role: initialStaff.role,
          specialties: initialStaff.specialties.join(', '),
          availability: getDefaultAvailability(initialStaff),
        }
      : {
          name: '',
          email: '',
          phone: '',
          role: '',
          specialties: '',
          availability: DAYS_OF_WEEK.map(day => ({ day, enabled: false, start_time: '', end_time: '' })),
        },
    mode: 'onBlur',
  });
  const { control, handleSubmit, reset, watch } = form;
  const { fields } = useFieldArray({
    control,
    name: 'availability',
  });
  useEffect(() => {
    if (initialStaff) {
      reset({
        name: initialStaff.name,
        email: initialStaff.email,
        phone: initialStaff.phone,
        role: initialStaff.role,
        specialties: initialStaff.specialties.join(', '),
        availability: getDefaultAvailability(initialStaff),
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        role: '',
        specialties: '',
        availability: DAYS_OF_WEEK.map(day => ({ day, enabled: false, start_time: '', end_time: '' })),
      });
    }
  }, [initialStaff, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1500px] w-full max-h-[100vh]">
        <DialogTitle>
          {mode === 'edit'
            ? initialStaff?.name ? `Edit ${initialStaff.name}` : 'Edit Staff Member'
            : 'Add Staff Member'}
        </DialogTitle>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="w-20 h-20 mb-2 border-2 border-primary">
                <AvatarImage src={initialStaff?.photo_url || '/default-avatar.png'} alt={initialStaff?.name || ''} />
                <AvatarFallback>{initialStaff?.name?.charAt(0) || ''}</AvatarFallback>
              </Avatar>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Specialties full width */}
            <div className="md:col-span-2">
              <FormField
                control={control}
                name="specialties"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialties</FormLabel>
                    <FormControl>
                      <Input placeholder="Comma separated" {...field} />
                    </FormControl>
                    <FormDescription>e.g. Haircut, Shave, Beard Trim</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Availability stays full width */}
            <div>
              <div className="font-semibold mb-1">Availability / Schedule</div>
              <div className="grid gap-2">
                {fields.map((field, idx) => (
                  <div key={field.day} className="flex items-center gap-2">
                    <Controller
                      control={control}
                      name={`availability.${idx}.enabled`}
                      render={({ field: cfield }) => (
                        <Checkbox checked={cfield.value} onCheckedChange={cfield.onChange} />
                      )}
                    />
                    <span className="w-20 inline-block">{field.day}:</span>
                    <Controller
                      control={control}
                      name={`availability.${idx}.start_time`}
                      render={({ field: cfield }) => (
                        <Input type="time" className="w-28" {...cfield} disabled={!watch(`availability.${idx}.enabled`)} />
                      )}
                    />
                    -
                    <Controller
                      control={control}
                      name={`availability.${idx}.end_time`}
                      render={({ field: cfield }) => (
                        <Input type="time" className="w-28" {...cfield} disabled={!watch(`availability.${idx}.enabled`)} />
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button type="submit" variant="default" className="flex-1">
                {mode === 'edit' ? 'Save' : 'Create'}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
            {mode === 'edit' && initialStaff && (
              <Button
                type="button"
                variant="destructive"
                className="w-full mt-2"
                onClick={() => {
                  // You may want to pass a prop for deactivation in the future
                  alert(`Staff with ID ${initialStaff.id} deactivated!`);
                  onOpenChange(false);
                }}
              >
                Deactivate Staff
              </Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const StaffTab: React.FC<StaffTabProps> = ({ staff, bookings }) => {
  // Assignment state: bookingId -> staffId
  const [assignments, setAssignments] = useState<{ [bookingId: string]: string }>({});
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [staffList, setStaffList] = useState(staff); // local state for staff
  const selectedStaff = staffList.find((m) => m.id === selectedStaffId) || null;

  const router = useRouter();
  const addStaffButton = (
    <Button onClick={() => setShowCreateDialog(true)}>
      <Plus className="w-4 h-4 mr-2" />
      Add Staff Member
    </Button>
  );

  // Dummy deactivate handler (now handled in StaffDialog)

  // Handle create staff
  const handleCreateStaff = (data: StaffFormType) => {
    // In a real app, send to backend
    setStaffList((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        specialties: (data.specialties || '').split(',').map(s => s.trim()),
        availability: data.availability.map(a => ({
          day: a.day,
          start_time: a.start_time || '',
          end_time: a.end_time || '',
        })),
        performance: { bookings_handled: 0, avg_rating: 0, total_ratings: 0 },
        photo_url: '',
        business_id: '', // placeholder, update as needed
      },
    ]);
    setShowCreateDialog(false);
  };

  // Handle edit staff (dummy, just closes dialog for now)
  const handleEditStaff = (data: StaffFormType) => {
    setSelectedStaffId(null);
  };

  return (
    <>
      <TabContentLayout title="Staff Management" actions={addStaffButton}>
        {/* Staff Table */}
        <div className="overflow-x-auto rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Specialties</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.photo_url || '/default-avatar.png'} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-semibold">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.specialties.join(', ')}</TableCell>
                  <TableCell>
                    <div>Bookings: <span className="font-semibold text-primary">{member.performance.bookings_handled}</span></div>
                    <div>Avg. Rating: <span className="font-semibold text-yellow-400">{member.performance.avg_rating}</span></div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setSelectedStaffId(member.id)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* Booking Assignment Table (unchanged) */}
        <div className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Assign Bookings to Staff
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium">Booking</th>
                  <th className="py-3 px-4 text-left font-medium">Current Staff</th>
                  <th className="py-3 px-4 text-left font-medium">Assign To</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <span className="font-semibold">{booking.service_name}</span>
                      <br />
                      <span className="text-xs text-muted-foreground">{booking.start_time} - {booking.end_time}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {assignments[booking.id]
                        ? staffList.find((s) => s.id === assignments[booking.id])?.name || '-' 
                        : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <Select
                        value={assignments[booking.id] || ''}
                        onValueChange={(value) => setAssignments((prev) => ({ ...prev, [booking.id]: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff" />
                        </SelectTrigger>
                        <SelectContent>
                          {staffList.map((member) => (
                            <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </CardContent>
          </Card>
        </div>
      </TabContentLayout>
      {/* Staff create dialog */}
      <StaffDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        mode="create"
        onSubmit={handleCreateStaff}
      />
      {/* Staff edit dialog */}
      <StaffDialog
        open={!!selectedStaffId}
        onOpenChange={(open) => { if (!open) setSelectedStaffId(null); }}
        initialStaff={selectedStaff}
        mode="edit"
        onSubmit={handleEditStaff}
      />
    </>
  );
};

const staffSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(5, 'Phone is required'),
  role: z.string().min(2, 'Role is required'),
  specialties: z.string().optional(), // comma separated
  availability: z.array(z.object({
    day: z.string(),
    enabled: z.boolean(),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
  })),
});

type StaffFormType = z.infer<typeof staffSchema>;

function getDefaultAvailability(staff: Staff) {
  // Map to all days, mark enabled if present in staff.availability
  return DAYS_OF_WEEK.map(day => {
    const slot = staff.availability.find((s: { day: string; start_time: string; end_time: string }) => s.day === day);
    return {
      day,
      enabled: !!slot,
      start_time: slot ? slot.start_time : '',
      end_time: slot ? slot.end_time : '',
    };
  });
}
