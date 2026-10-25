import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { MatchedSchemes } from './pages/MatchedSchemes';
import { SchemeDetails } from './pages/SchemeDetails';
import { MyClaims } from './pages/MyClaims';
import { Troubleshoot } from './pages/Troubleshoot';
import { AssistantChat } from './components/AssistantChat';
import { SCHEMES } from './data/schemes';
import { 
  UserProfile, 
  ClaimRecord, 
  ClaimStatus, 
  SchemeEvaluationResult,
  DocumentReadinessState
} from './types';
import { 
  getStoredProfile, 
  saveStoredProfile, 
  getStoredClaims, 
  saveStoredClaims,
  SAMPLE_PRESETS,
  addClaimForScheme,
  prepareFreshCitizenData
} from './utils/storage';
import { evaluateAllSchemes } from './utils/matcher';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);
  const [profile, setProfileState] = useState<UserProfile>(() => {
    prepareFreshCitizenData();
    return getStoredProfile();
  });
  const [claims, setClaimsState] = useState<ClaimRecord[]>(getStoredClaims);

  // Compute match results dynamically against current profile using deterministic engine
  const matchResults: SchemeEvaluationResult[] = useMemo(() => {
    return evaluateAllSchemes(SCHEMES, profile);
  }, [profile]);

  const eligibleCount = useMemo(() => {
    return matchResults.filter(r => r.outcome === 'POTENTIAL MATCH').length;
  }, [matchResults]);

  const savedClaimSchemeIds = useMemo(() => {
    return claims.map(c => c.schemeId);
  }, [claims]);

  // Persist profile changes
  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
    saveStoredProfile(newProfile);
  };

  // Preset quick-select
  const handleSelectPreset = (presetIndex: number) => {
    const selected = SAMPLE_PRESETS[presetIndex];
    if (selected) {
      handleUpdateProfile({ ...selected.profile });
    }
  };

  // Navigation handler
  const navigate = (route: string, param?: string) => {
    setCurrentRoute(route);
    if (param) {
      setSelectedSchemeId(param);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Claim actions
  const handleToggleClaim = (schemeId: string) => {
    const existing = claims.find(c => c.schemeId === schemeId);
    if (existing) {
      // Remove
      const updated = claims.filter(c => c.schemeId !== schemeId);
      setClaimsState(updated);
      saveStoredClaims(updated);
    } else {
      // Add
      addClaimForScheme(schemeId);
      setClaimsState(getStoredClaims());
    }
  };

  const handleUpdateClaimStatus = (claimId: string, status: ClaimStatus) => {
    const updated = claims.map(c => {
      if (c.id === claimId) {
        return { ...c, status, lastUpdated: new Date().toISOString() };
      }
      return c;
    });
    setClaimsState(updated);
    saveStoredClaims(updated);
  };

  const handleUpdateClaimField = (claimId: string, field: 'applicationNumber' | 'notes', value: string) => {
    const updated = claims.map(c => {
      if (c.id === claimId) {
        return { ...c, [field]: value, lastUpdated: new Date().toISOString() };
      }
      return c;
    });
    setClaimsState(updated);
    saveStoredClaims(updated);
  };

  const handleRemoveClaim = (claimId: string) => {
    const updated = claims.filter(c => c.id !== claimId);
    setClaimsState(updated);
    saveStoredClaims(updated);
  };

  const handleUpdateDocState = (schemeId: string, docId: string, state: DocumentReadinessState) => {
    const currentClaim = claims.find(c => c.schemeId === schemeId);
    let updatedClaims: ClaimRecord[];

    if (!currentClaim) {
      const newClaim = addClaimForScheme(schemeId);
      const newDocStates: Record<string, DocumentReadinessState> = {
        ...(newClaim.documentStates || {}),
        [docId]: state,
      };
      const newGathered = Object.entries(newDocStates)
        .filter(([_, s]) => s === 'ready')
        .map(([id]) => id);

      const initializedClaim: ClaimRecord = {
        ...newClaim,
        lastUpdated: new Date().toISOString(),
        documentStates: newDocStates,
        gatheredDocIds: newGathered,
      };

      const existingClaimsWithoutNew = claims.filter(c => c.schemeId !== schemeId);
      updatedClaims = [initializedClaim, ...existingClaimsWithoutNew];
    } else {
      const newDocStates: Record<string, DocumentReadinessState> = {
        ...(currentClaim.documentStates || {}),
        [docId]: state,
      };
      const newGathered = Object.entries(newDocStates)
        .filter(([_, s]) => s === 'ready')
        .map(([id]) => id);

      updatedClaims = claims.map(c => {
        if (c.id === currentClaim.id) {
          return {
            ...c,
            lastUpdated: new Date().toISOString(),
            documentStates: newDocStates,
            gatheredDocIds: newGathered,
          };
        }
        return c;
      });
    }

    setClaimsState(updatedClaims);
    saveStoredClaims(updatedClaims);
  };

  const handleToggleStep = (schemeId: string, stepNumber: number) => {
    const currentClaim = claims.find(c => c.schemeId === schemeId);
    let updatedClaims: ClaimRecord[];

    if (!currentClaim) {
      const newClaim = addClaimForScheme(schemeId);
      const initializedClaim: ClaimRecord = {
        ...newClaim,
        lastUpdated: new Date().toISOString(),
        completedStepNumbers: [stepNumber],
      };
      const existingClaimsWithoutNew = claims.filter(c => c.schemeId !== schemeId);
      updatedClaims = [initializedClaim, ...existingClaimsWithoutNew];
    } else {
      const stepNumbers = currentClaim.completedStepNumbers || [];
      const alreadyCompleted = stepNumbers.includes(stepNumber);
      const updatedSteps = alreadyCompleted
        ? stepNumbers.filter(s => s !== stepNumber)
        : [...stepNumbers, stepNumber];

      updatedClaims = claims.map(c => {
        if (c.id === currentClaim.id) {
          return {
            ...c,
            lastUpdated: new Date().toISOString(),
            completedStepNumbers: updatedSteps,
          };
        }
        return c;
      });
    }

    setClaimsState(updatedClaims);
    saveStoredClaims(updatedClaims);
  };

  // Render active page
  const renderPage = () => {
    switch (currentRoute) {
      case 'home':
        return (
          <Home
            navigate={navigate}
            schemes={SCHEMES}
            onSelectPreset={handleSelectPreset}
          />
        );

      case 'profile':
        return (
          <Profile
            profile={profile}
            setProfile={handleUpdateProfile}
            onSaveAndFindMatches={() => navigate('matched')}
            eligibleCount={eligibleCount}
          />
        );

      case 'matched':
        return (
          <MatchedSchemes
            matchResults={matchResults}
            profile={profile}
            navigate={navigate}
            savedClaimSchemeIds={savedClaimSchemeIds}
            onToggleClaim={handleToggleClaim}
          />
        );

      case 'details': {
        const scheme = SCHEMES.find(s => s.id === selectedSchemeId) || SCHEMES[0];
        const claim = claims.find(c => c.schemeId === scheme.id);
        return (
          <SchemeDetails
            scheme={scheme}
            profile={profile}
            claim={claim}
            navigate={navigate}
            onUpdateDocState={handleUpdateDocState}
            onToggleStep={handleToggleStep}
            onSaveClaim={handleToggleClaim}
          />
        );
      }

      case 'claims':
        return (
          <MyClaims
            claims={claims}
            schemes={SCHEMES}
            profile={profile}
            navigate={navigate}
            onUpdateClaimStatus={handleUpdateClaimStatus}
            onUpdateClaimField={handleUpdateClaimField}
            onRemoveClaim={handleRemoveClaim}
            onUpdateDocState={handleUpdateDocState}
          />
        );

      case 'troubleshoot':
        return <Troubleshoot />;

      default:
        return (
          <Home
            navigate={navigate}
            schemes={SCHEMES}
            onSelectPreset={handleSelectPreset}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfbf9] text-navy-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      <Navbar
        currentRoute={currentRoute}
        navigate={navigate}
        claimCount={claims.length}
        matchedCount={eligibleCount}
      />
      
      <main className="flex-1">
        {renderPage()}
      </main>

      <Footer navigate={navigate} />
      <AssistantChat matchResults={matchResults} navigate={navigate} />
    </div>
  );
};

export default App;
