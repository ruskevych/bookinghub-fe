'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Separator } from "@/registry/new-york-v4/ui/separator";
import { 
  Award, 
  CheckCircle, 
  Calendar,
  MapPin,
  Clock,
  Shield,
  Star,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Provider } from '@/types/provider';

interface ProviderAboutProps {
  provider: Provider;
  compact?: boolean;
}

export function ProviderAbout({ provider, compact = false }: ProviderAboutProps) {
  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">About</h3>
          <Badge variant="outline" className="text-xs">
            {provider.yearsExperience}+ years experience
          </Badge>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {provider.bio.slice(0, 200)}...
            </p>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {provider.verificationStatus.badges.slice(0, 3).map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
              {provider.verificationStatus.badges.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{provider.verificationStatus.badges.length - 3} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">About {provider.name}</h2>
        <p className="text-muted-foreground">
          Get to know more about this professional
        </p>
      </div>

      {/* Bio Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Professional Background
            {provider.verificationStatus.isVerified && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            {provider.bio}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Experience</span>
              </div>
              <p className="font-semibold">{provider.yearsExperience}+ years</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Service Area</span>
              </div>
              <p className="font-semibold">
                {provider.location.city}, {provider.location.state} 
                ({provider.location.serviceRadius} mile radius)
              </p>
            </div>
            
            {provider.languages && provider.languages.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Languages</span>
                </div>
                <p className="font-semibold">{provider.languages.join(', ')}</p>
              </div>
            )}
            
            {provider.responseTime && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Response Time</span>
                </div>
                <p className="font-semibold">{provider.responseTime}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Verification & Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Verification & Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Verification Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Verification Status</h4>
              <div className="space-y-2">
                <VerificationItem
                  label="Identity Verified"
                  verified={provider.verificationStatus.isVerified}
                />
                <VerificationItem
                  label="Phone Verified"
                  verified={provider.verificationStatus.phoneVerified}
                />
                <VerificationItem
                  label="Email Verified"
                  verified={provider.verificationStatus.emailVerified}
                />
                <VerificationItem
                  label="Background Check"
                  verified={provider.verificationStatus.backgroundCheck}
                />
                <VerificationItem
                  label="License Verified"
                  verified={provider.verificationStatus.licenseVerified}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Achievements</h4>
              <div className="flex flex-wrap gap-2">
                {provider.verificationStatus.badges.map((badge) => (
                  <Badge key={badge} variant="secondary" className="text-sm">
                    <Award className="w-3 h-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      {provider.certifications && provider.certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Certifications & Credentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {provider.certifications.map((cert) => (
                <div key={cert.id} className="border-l-4 border-primary pl-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {cert.name}
                        {cert.isVerified && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Issued: {format(new Date(cert.issueDate), 'MMM yyyy')}
                        {cert.expiryDate && (
                          <span> • Expires: {format(new Date(cert.expiryDate), 'MMM yyyy')}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Business Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(provider.businessHours).map(([day, hours]) => (
              <div key={day} className="flex items-center justify-between">
                <span className="capitalize font-medium">{day}</span>
                <span className={cn(
                  "text-sm",
                  !hours.isOpen && "text-muted-foreground"
                )}>
                  {hours.isOpen ? (
                    <span>
                      {hours.openTime} - {hours.closeTime}
                      {hours.breaks && hours.breaks.length > 0 && (
                        <span className="text-muted-foreground ml-2">
                          (Break: {hours.breaks[0].startTime} - {hours.breaks[0].endTime})
                        </span>
                      )}
                    </span>
                  ) : (
                    'Closed'
                  )}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Media & Links */}
      {provider.socialMedia && (
        <Card>
          <CardHeader>
            <CardTitle>Online Presence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {provider.socialMedia.website && (
                <a
                  href={provider.socialMedia.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="font-medium">Website</span>
                </a>
              )}
              {provider.socialMedia.instagram && (
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <span className="font-medium">Instagram</span>
                  <span className="text-muted-foreground">{provider.socialMedia.instagram}</span>
                </div>
              )}
              {provider.socialMedia.facebook && (
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <span className="font-medium">Facebook</span>
                  <span className="text-muted-foreground">{provider.socialMedia.facebook}</span>
                </div>
              )}
              {provider.socialMedia.linkedin && (
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <span className="font-medium">LinkedIn</span>
                  <span className="text-muted-foreground">{provider.socialMedia.linkedin}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Area Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Service Area
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Service area map would be displayed here</p>
              <p className="text-xs">
                Covers {provider.location.serviceRadius} mile radius from {provider.location.city}, {provider.location.state}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface VerificationItemProps {
  label: string;
  verified: boolean;
}

function VerificationItem({ label, verified }: VerificationItemProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        {verified ? (
          <>
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">Verified</span>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">Not verified</span>
        )}
      </div>
    </div>
  );
} 