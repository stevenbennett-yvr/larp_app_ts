import { z } from 'zod'
import { meritSchema } from './Merits'
import { Awakened } from './Awakened'

export const cabalMemberSchema = z.object({
    id: z.string(),
    name: z.string(),
    concept: z.string(),
    path: z.string(),
    order: z.string(),
    merits: z.array(meritSchema)
})

export type CabalMember = z.infer<typeof cabalMemberSchema>

export const cabalSchema = z.object({
    ownerId: z.string(),
    memberIds: z.array(z.string()),
    members: z.array(cabalMemberSchema),
    invitations: z.array(z.string()),
    name: z.string(),
    concept: z.string(),
    id: z.optional(z.string()),
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
    }
}

  // get Invite Data
export const fetchInviteData =
    async (awakened:Awakened, setInviteData:Function, getCabalInvitations:Function) => {
      try {
        const retrievedInviteData = await getCabalInvitations(awakened.id);
        const updatedInviteData = retrievedInviteData || null;
        setInviteData(updatedInviteData);
      } catch (error) {
        console.error("Error retrieving cabal data:", error);
      }
    };

    // get Cabal Data
export const fetchCabalData = async (awakened: Awakened, cabalData:Cabal, setCabalData:Function, updateCabal:Function, getCabalData:Function ) => {
    // General Cabal Data Section
    try {
        const retrievedCabalData = await getCabalData(awakened.id);
        const updatedCabalData = retrievedCabalData || cabalData;
        setCabalData(updatedCabalData);
    } catch (error) {
        console.error("Error retrieving cabal data:", error);
    }

    // Update Member Merit section Data.
    if (awakened.id && cabalData?.id) {
        const characterMemberData = cabalData.members.find(member => member.id === awakened.id);
    
        if (characterMemberData && characterMemberData.merits !== awakened.merits) {
        const updatedMember = { ...characterMemberData, merits: awakened.merits };
        const updatedMembers = cabalData.members.map(member => (member.id === awakened.id ? updatedMember : member));
        const updatedCabal = { ...cabalData, members: updatedMembers };
        
        updateCabal(cabalData.id, updatedCabal);
        setCabalData(updatedCabal);
        }
    }
    };

    // Create Cabal Function
export async function handleCreateCabal(awakened:Awakened, cabalData:Cabal, setCabalData:Function, onSubmitCabal:Function) {
    if (awakened.id) {

    try {
      let updatedCabalData = {...cabalData, 
        memberIds: [awakened.id], 
        members: [
          {
            id: awakened.id,
            name: awakened.name,
            concept: awakened.concept,
            path: awakened.path,
            order: awakened.order,
            merits: awakened.merits,
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
