import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useClassesByDayNumber } from "@/hooks/useApi";
import { ClassResponse } from "@/types/api";
import { Calendar, Clock, Loader2, UserPlus, Users } from "lucide-react";

interface ClassScheduleProps {
  onRegisterStudent: (classItem: ClassResponse) => void;
}

// Map day number (0-6) to day labels
// 0 = Sunday, 1 = Monday, 2 = Tuesday, ..., 6 = Saturday
const dayNumberToLabel: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

// Display order: Monday first, then rest of the week
const daysOfWeek = [1, 2, 3, 4, 5, 6, 0]; // Monday to Sunday

export function ClassSchedule({ onRegisterStudent }: ClassScheduleProps) {
  // Format time from "HH:mm:ss" to "HH:mm"
  const formatTime = (time: string): string => {
    if (!time) return "";
    // If already in HH:mm format, return as is
    if (time.length === 5) return time;
    // If in HH:mm:ss format, remove seconds
    if (time.length === 8) return time.substring(0, 5);
    return time;
  };

  // Create timeSlot from startTime and endTime
  const getTimeSlot = (cls: ClassResponse): string => {
    if (cls.timeSlot) return cls.timeSlot;
    const start = formatTime(cls.startTime);
    const end = formatTime(cls.endTime);
    return `${start} - ${end}`;
  };

  // Get current students count (default to 0 if not provided)
  const getCurrentStudentsCount = (cls: ClassResponse): number => {
    return cls.currentStudentsCount ?? 0;
  };

  // Check if class is full
  const isClassFull = (cls: ClassResponse): boolean => {
    return cls.full ?? (getCurrentStudentsCount(cls) >= cls.maxStudents);
  };

  const getCapacityBadgeVariant = (cls: ClassResponse) => {
    const currentCount = getCurrentStudentsCount(cls);
    const isFull = isClassFull(cls);
    if (isFull) return "destructive";
    if (currentCount / cls.maxStudents >= 0.8) return "secondary";
    return "outline";
  };

  const sortClassesByTime = (classes: ClassResponse[]) => {
    return [...classes].sort((a, b) => {
      // Extract time from startTime (format: "HH:mm:ss" or "HH:mm")
      const getStartTimeMinutes = (time: string) => {
        const formatted = formatTime(time);
        const [hours, minutes] = formatted.split(':').map(Number);
        return hours * 60 + minutes;
      };
      return getStartTimeMinutes(a.startTime) - getStartTimeMinutes(b.startTime);
    });
  };

  return (
    <Card className="border shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          Weekly Class Schedule
        </CardTitle>
        <CardDescription className="mt-2">
          View all classes organized by day of the week
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 overflow-x-auto">
          {daysOfWeek.map((dayNumber) => {
            const { data: dayClasses = [], isLoading, error } = useClassesByDayNumber(dayNumber);
            const sortedClasses = sortClassesByTime(dayClasses);
            
            return (
              <div key={dayNumber} className="space-y-3">
                <div className="text-center pb-2 border-b">
                  <h3 className="font-semibold text-sm text-foreground">{dayNumberToLabel[dayNumber]}</h3>
                  {isLoading ? (
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      {sortedClasses.length} {sortedClasses.length === 1 ? 'class' : 'classes'}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2 min-h-[200px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : error ? (
                    <div className="text-center text-destructive text-xs py-8">
                      Error loading classes
                    </div>
                  ) : sortedClasses.length > 0 ? (
                    sortedClasses.map((cls) => {
                      const currentCount = getCurrentStudentsCount(cls);
                      const isFull = isClassFull(cls);
                      const timeSlot = getTimeSlot(cls);
                      return (
                        <div 
                          key={cls.id} 
                          className="p-3 border rounded-lg bg-card hover:bg-accent/50 transition-all hover:shadow-sm"
                        >
                          <div className="space-y-2">
                            <div>
                              <h4 className="font-medium text-sm text-foreground">{cls.name}</h4>
                              <p className="text-xs text-muted-foreground">{cls.subject}</p>
                            </div>
                            
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {timeSlot}
                            </div>
                            
                            <div className="text-xs text-muted-foreground">
                              Teacher: {cls.teacherName}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Badge variant={getCapacityBadgeVariant(cls)} className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                {cls.maxStudents}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => onRegisterStudent(cls)}
                                  disabled={isFull}
                                  className="h-6 px-2 text-xs"
                                  title={isFull ? "Class is full" : "Register student"}
                                >
                                  <UserPlus className="h-3 w-3" />
                                </Button>
                                
                              </div>
                            </div>
                            
                            {isFull && (
                              <Badge variant="destructive" className="w-full justify-center text-xs">
                                FULL
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-muted-foreground text-xs py-8">
                      No classes scheduled
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}