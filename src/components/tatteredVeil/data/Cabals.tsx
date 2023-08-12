import { z } from 'zod'
import { meritSchema } from './Merits'
import { Awakened, backgroundSchema } from './Awakened'
import { pathNameSchema } from './Path'
import { orderNameSchema } from './Order'

export const cabalMemberSchema = z.object({
    id: z.string(),
    name: z.string(),
    concept: z.string(),
    path: pathNameSchema,
    order: orderNameSchema,
    merits: z.array(meritSchema),
    background: backgroundSchema,
})

export const cabalSanctumSchema = z.object({
  location: z.string(),
  description: z.string(),
})

export type CabalMember = z.infer<typeof cabalMemberSchema>

export const cabalSchema = z.object({
    ownerId: z.string(),
    memberIds: z.array(z.string()),
    members: z.array(cabalMemberSchema),
    invitations: z.array(z.string()),
    name: z.string(),
    concept: z.string(),
    tenants: z.string(),
    goals: z.string(),
    id: z.optional(z.string()),
    sanctum: cabalSanctumSchema
})

export type Cabal = z.infer<typeof cabalSchema>

export const emptyCabal = (): Cabal => {
    return {
        ownerId: "",
        memberIds: [],
        members: [],
        invitations: [],
        name: "",
        concept: "",
        tenants: "",
        goals: "",
        sanctum: {
          location: "",
          description: "",
        },
    }
}

  // get Invite Data
export const fetchInviteData = async (
    awakened: Awakened,
    setInviteData: Function,
    getCabalInvitations: Function
  ) => {
    const cacheKey = `inviteData_${awakened.id}`;
  
    const cachedInviteData = localStorage.getItem(cacheKey);
  
    if (cachedInviteData) {
      const parsedInviteData = JSON.parse(cachedInviteData);
      setInviteData(parsedInviteData);
    } else {
      try {
        console.log("fetchInvite")
        const retrievedInviteData = await getCabalInvitations(awakened.id);
        const updatedInviteData = retrievedInviteData || null;
        setInviteData(updatedInviteData);
        localStorage.setItem(cacheKey, JSON.stringify(updatedInviteData));
      } catch (error) {
        console.error("Error retrieving invite data:", error);
      }
    }
  };

    // get Cabal Data
export const fetchCabalData = async (awakened: Awakened, cabalData:Cabal, setCabalData:Function, getCabalData:Function ) => {

    const cachedCabalData = localStorage.getItem(`cabalMember id ${awakened.id}`);

    if (cachedCabalData) {
      const parsedCabalData = JSON.parse(cachedCabalData);
      setCabalData(parsedCabalData);
    } else {

    try {
        console.log('fetch Cabal')
        const retrievedCabalData = await getCabalData(awakened.id);
        const updatedCabalData = retrievedCabalData || cabalData;
        setCabalData(updatedCabalData);
        localStorage.setItem(`cabalMember id ${awakened.id}`, JSON.stringify(updatedCabalData));
    } catch (error) {
        console.error("Error retrieving cabal data:", error);
    }
  }

    // Update Member Merit section Data.
/*     if (awakened.id && cabalData?.id) {
        const characterMemberData = cabalData.members.find(member => member.id === awakened.id);
    
        if (characterMemberData && (characterMemberData.merits !== awakened.merits || characterMemberData.background !== awakened.background)) {
        const updatedMember = { ...characterMemberData, merits: awakened.merits, background: awakened.background };
        const updatedMembers = cabalData.members.map(member => (member.id === awakened.id ? updatedMember : member));

        const updatedCabal = { ...cabalData, members: updatedMembers };

        updateCabal(cabalData.id, updatedCabal);
        setCabalData(updatedCabal);
        localStorage.setItem(`cabal ${cabalData.id}`, JSON.stringify(updatedCabal));

        }
    } */
    };

    // Create Cabal Function
export async function handleCreateCabal(awakened:Awakened, cabalData:Cabal, setCabalData:Function, onSubmitCabal:Function) {
    if (awakened.id) {

    try {
      let updatedCabalData = {...cabalData, 
        ownerId: awakened.id,
        memberIds: [awakened.id], 
        members: [
          {
            id: awakened.id,
            name: awakened.name,
            concept: awakened.concept,
            path: awakened.path,
            order: awakened.order,
            merits: awakened.merits,
            background: awakened.background,
          },
        ]
      }
      await onSubmitCabal(updatedCabalData);
      setCabalData(updatedCabalData)
      } catch (error) {
        console.error("Failed to create Cabal:", error);
      }
    }
  }



    // Invite functions

export const handleInvite = (inviteeId:string, cabalData:Cabal, setCabalData:Function, updateCabal:Function) => {
    if (cabalData.id) {
    const updatedCabalData = {
      ...cabalData,
      invitations: [...(cabalData.invitations), inviteeId],
    };
    setCabalData(updatedCabalData);
    updateCabal(cabalData.id, updatedCabalData)
    }
  }

export const handleAcceptInvite = (awakened:Awakened, inviteData:Cabal, updateCabal:Function, setCabalData:Function) => {
    if (inviteData && inviteData.id) {
      const updatedInvitations = inviteData.invitations.filter(
        (invitationId) => invitationId !== awakened.id
      );
  
      const updatedCabalData = {
        ...inviteData,
        invitations: updatedInvitations,
        memberIds: [...(inviteData.memberIds || []), awakened.id],
        members: [
          ...(inviteData.members || []),
          {
            id: awakened.id,
            name: awakened.name,
            concept: awakened.concept,
            path: awakened.path,
            order: awakened.order,
            merits: awakened.merits,
            background: awakened.background,
          },
        ],
      };
      updateCabal(inviteData.id, updatedCabalData);
      setCabalData(updatedCabalData);
    }
  };
  
export const handleRejectInvite = (awakened:Awakened, inviteData:Cabal, setInviteData:Function, updateCabal:Function, getCabalInvitations:Function) => {
    if (inviteData && inviteData.id) {

    const updatedInvitations = inviteData.invitations.filter(
      (invitationId) => invitationId !== awakened.id
    );
  
    const updatedCabalData = {
      ...inviteData,
      invitations: updatedInvitations,
    };
    updateCabal(inviteData.id, updatedCabalData);
    fetchInviteData(awakened, setInviteData, getCabalInvitations)
    }
  };

export const handleLeaveCabal = async (characterId:string, cabalData:Cabal, updateCabal:Function, setCabalData:Function) => {
    if (cabalData && cabalData.id && cabalData.ownerId){
      let updatedCabalData;
      if (characterId === cabalData.ownerId) {
      const newOwnerIndex = Math.floor(Math.random() * cabalData.memberIds.length);
      const newOwnerId = cabalData.memberIds[newOwnerIndex];
      
      updatedCabalData = {
        ...cabalData,
        ownerId: newOwnerId,
        members: cabalData.members.filter((member) => member.id !== characterId),
        memberIds: cabalData.memberIds.filter((memberId) => memberId !== characterId),
      };
    } else {
      updatedCabalData = {
        ...cabalData,
        members: cabalData.members.filter((member) => member.id !== characterId),
        memberIds: cabalData.memberIds.filter((memberId) => memberId !== characterId),
      };
    }
    setCabalData(emptyCabal());
    await updateCabal(cabalData.id, updatedCabalData);
  }};
