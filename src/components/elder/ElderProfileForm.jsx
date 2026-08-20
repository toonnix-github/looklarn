import React from 'react';
import { GeneralInfoSection } from './GeneralInfoSection';
import { MobilitySection } from './MobilitySection';
import { MedicalConditionsSection } from './MedicalConditionsSection';
import { PreferencesSection } from './PreferencesSection';
import { EmergencyContactsSection } from './EmergencyContactsSection';

export function ElderProfileForm({
  formData,
  onChange,
  onSubmit,
  className = '',
}) {
  const handleFieldChange = (field, value) => {
    onChange?.({
      ...formData,
      [field]: value,
    });
  };

  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      <GeneralInfoSection
        formData={formData}
        onChange={handleFieldChange}
      />

      <MobilitySection
        mobilityLevel={formData.mobilityLevel}
        mobilityAids={formData.mobilityAids}
        onChange={handleFieldChange}
      />

      <MedicalConditionsSection
        conditions={formData.conditions}
        allergies={formData.allergies}
        medications={formData.medications}
        preferredHospital={formData.preferredHospital}
        hospitalHn={formData.hospitalHn}
        onChange={handleFieldChange}
      />

      <PreferencesSection
        languages={formData.preferredLanguages}
        religion={formData.religion}
        dietary={formData.dietaryPreferences}
        specialNotes={formData.specialNotes}
        onChange={handleFieldChange}
      />

      <EmergencyContactsSection
        guardianName={formData.guardianName}
        guardianPhone={formData.guardianPhone}
        guardianEmail={formData.guardianEmail}
        emergencyName={formData.emergencyName}
        emergencyPhone={formData.emergencyPhone}
        address={formData.address}
        onChange={handleFieldChange}
      />
    </form>
  );
}

export default ElderProfileForm;
