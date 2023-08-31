import { Select, Group, Text, Button, Navbar, Card, Center, ScrollArea, Stack, Modal, Input, Avatar, Tooltip, TextInput } from '@mantine/core';
import { useEffect, useState, forwardRef } from 'react'
import { globals } from '../../../assets/globals';
import { MageBounty, getEmptyMageBounty } from '../../../data/TatteredVeil/types/MageBounty';
import { Awakened } from '../../../data/TatteredVeil/types/Awakened';
import { RichTextEditor } from '@mantine/rte';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookBookmark, faInfo, faList } from '@fortawesome/free-solid-svg-icons';
import { Paths } from '../../../data/TatteredVeil/types/Path';
import { Orders } from '../../../data/TatteredVeil/types/Order';
import './bounty.css'
import moment from 'moment';

export type MageBountyBoardProps = {
    currentUser: any;
    userAwakenedList: Awakened[];
    domainAwakenedList: Awakened[];
}

const MageBountyBoard = ({currentUser, userAwakenedList, domainAwakenedList}: MageBountyBoardProps) => {
    const [showCreateBounty, setShowCreateBounty] = useState<boolean>(false);
    const [newBounty, setNewBounty] = useState<MageBounty>(getEmptyMageBounty())
    const [bounties, setBounties] = useState<MageBounty[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>("");

    // TODO: Fix Rich Text ids to get them working togeather properly. Attach to Firebase

    const selectData = userAwakenedList
    .filter((awakened) => awakened.background.showPublic === true)
    .map((awakened) => ({
      label: `${awakened.name}`,
      value: `${awakened.id}`
    }));

    if (selectData.length > 0 && selectedCharacter === "") {
        setSelectedCharacter(selectData[0].value)
    }

    interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
        label: string;
      }
    
    const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
        ({ label, ...others }: ItemProps, ref) => (
            <div ref={ref} {...others} style={{border: '1px solid white'}}>
                <Group noWrap>
                <div>
                    <Text size="sm" color="white">{label}</Text>
                </div>
                </Group>
            </div>
        )
    );

    const handleCreateBounty = () => {
        const selectedAwakened = userAwakenedList.find(
            (character) => character.id === selectedCharacter
        );

        if (newBounty.title && newBounty.description && selectedAwakened?.id) {
            const ownerData = {
                id: selectedAwakened.id,
                uid: selectedAwakened.uid,
            }
            const updatedBounty = { ...newBounty, owner: ownerData };
            console.log("Updated bounty with ownerId:", updatedBounty);
    
            setNewBounty(updatedBounty);

            setShowCreateBounty(false)
    
            const updatedBounties = [...bounties, updatedBounty];
            setBounties(updatedBounties);
    
            // Save to local storage
            localStorage.setItem('bounties', JSON.stringify(updatedBounties));
    
            // Clear input fields
            setNewBounty(getEmptyMageBounty());
        }
    };

    const [selectedBountyIndex, setSelectedBountyIndex] = useState<number | null>(null);

    const handleBountyClick = (index: number) => {
        setSelectedBountyIndex(index);
    };

    const questDisplay = () => {
        return (
        <ScrollArea h={height - 60} type="never">
            <Stack style={{paddingBottom:"50px"}}>
                {bounties.map((bounty: any, index: number) => {
                    
                    const matchingAwakened = domainAwakenedList.find(awakened => awakened.id === bounty.owner.id);

                    return (
                    <Card
                        key={index}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            padding: "10px",
                            marginBottom: "10px",
                            cursor: "pointer",
                            width: "260px"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#141517"} // Change to a lighter shade on hover
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
                        onClick={() => handleBountyClick(index)}
                    >
                        <Text fz="xl" color="dimmed">
                            {bounty.title}
                        </Text>
                        <Tooltip.Group openDelay={300} closeDelay={100}>
                            <Avatar.Group spacing="sm">
                                <Tooltip label={matchingAwakened?.name} withArrow>
                                    <Avatar src={matchingAwakened?.background.profilePic} radius="xl"  size="sm" style={{ backgroundImage: matchingAwakened? `linear-gradient(to bottom right, ${Paths[matchingAwakened.path]?.color}, ${Orders[matchingAwakened.order]?.color})` : 'none'}} />
                                </Tooltip>
                            </Avatar.Group>
                        </Tooltip.Group>
                    </Card>
                )})}
                {
                    selectData.length===0?
                    <></>
                    :
                    <Button color='gray' onClick={() => setShowCreateBounty(true)}>Add a bounty</Button>
                }
            </Stack>
        </ScrollArea>
        )
    }

    const createBountyModal = () => {
        return(
        <Modal opened={showCreateBounty} onClose={() => setShowCreateBounty(false)} size="50rem">
            <Stack>
                <div>
            <Text fz="lg" color="dimmed">
                <FontAwesomeIcon icon={faBookBookmark} /> Bounty Title
            </Text>
            <Input
                placeholder="Bounty Title"
                value={newBounty.title}
                onChange={(event) => setNewBounty({...newBounty, title:event.target.value})}
            />
            </div>
            <div>
            <Text fz="lg" color="dimmed">
                <FontAwesomeIcon icon={faInfo} /> Description
            </Text>
            <RichTextEditor
                placeholder='Your initial Bounty description. Fill with whatever details you need to get others up to speed.'
                id="rte-newBountyDescription"
                value={newBounty.description}
                style={{ padding: '5px' }}
                onChange={(val) => setNewBounty({...newBounty, description:val})}
            />
            </div>
            <Select
                label="Bounty Owner"
                data={selectData}
                value={selectedCharacter}
                onChange={(val) => setSelectedCharacter(val)}
                placeholder='Select Character to post Bounty'
                itemComponent={SelectItem}
                searchable
                allowDeselect
            />
            <Button onClick={handleCreateBounty}>Create Bounty</Button>
            </Stack>
        </Modal>
        )
    }

    const handleBountyEdit = (index: number, updatedBounty: MageBounty) => {
        const updatedBounties = [...bounties];
        updatedBounties[index] = updatedBounty;
        setBounties(updatedBounties);
    
        // Update local storage
        localStorage.setItem('bounties', JSON.stringify(updatedBounties));
    };


    const handleComment = (selectedBountyIndex:number) => {
        const selectedAwakened = userAwakenedList.find(
            (character) => character.id === selectedCharacter
        );

        if (selectedAwakened?.id) {
            const ownerData = {
                id: selectedAwakened.id,
                uid: selectedAwakened.uid,
            }


            const updatedComment = {
                ...newComment,
                owner: ownerData,
            };

            const updatedActivities = [
                ...bounties[selectedBountyIndex].activity,
                updatedComment,
            ];

            handleBountyEdit(selectedBountyIndex, {
                ...bounties[selectedBountyIndex],
                activity: updatedActivities,
            });
            
            setNewComment({
                owner: {
                    id: "",
                    uid: "",
                },
                description: "",
                timestamp: new Date().toISOString()
            });
            
            // Close the new comment section
            setShowNewCommentSection(false);
        }
    }
    
    const CommentSection = ({comments, selectedBountyIndex}: any) => {
        
        const [editableComments, setEditableComments] = useState(comments.map(() => false));
        const [deleteModalOpen, setDeleteModalOpen] = useState(false);
        const [commentToDeleteIndex, setCommentToDeleteIndex] = useState(-1);
    
        const toggleEdit = (index: any) => {
            const updatedEditableComments = editableComments.map((_value:any, i:any) => i === index ? true : false);
            setEditableComments(updatedEditableComments);
        };

        const toggleSave = (commentIndex: any) => {

            const updatedActivities = bounties[selectedBountyIndex].activity.map((activity, index) => {
                if (index === commentIndex) {
                    return {
                        ...activity,
                        timestamp: new Date().toISOString(),
                    };
                }
                return activity;
            });

            handleBountyEdit(selectedBountyIndex, {
                ...bounties[selectedBountyIndex],
                activity: updatedActivities,
            });

            const updatedEditableComments = [...editableComments];
            updatedEditableComments[commentIndex] = false;
            setEditableComments(updatedEditableComments);
        }

        const deleteComment = (index: number, selectedBountyIndex: number) => {
            const updatedActivities = [...comments];
            updatedActivities.splice(index, 1);

            handleBountyEdit(selectedBountyIndex, {
                ...bounties[selectedBountyIndex],
                activity: updatedActivities,
            });
            setDeleteModalOpen(false)
        };

        return (
          <div>
            {comments.map((comment: any, index: number) => {


            const openDeleteModal = (index: number) => {
                setDeleteModalOpen(true);
                setCommentToDeleteIndex(index);
            };

            const closeDeleteModal = () => {
                setDeleteModalOpen(false);
                setCommentToDeleteIndex(-1);
            };

            const matchingAwakened = domainAwakenedList.find(awakened => awakened.id === comment.owner.id);
            return (
            <div>
              <Group key={index}>
                <Tooltip label={matchingAwakened?.name} withArrow>
                <Avatar
                    src={matchingAwakened?.background.profilePic} radius="xl"  size="sm" style={{ backgroundImage: matchingAwakened? `linear-gradient(to bottom right, ${Paths[matchingAwakened.path]?.color}, ${Orders[matchingAwakened.order]?.color})` : 'none'}}
                />
                </Tooltip>
                <Input.Wrapper
                  id={`rte-commentDescription-${index}`}
                  label={`${matchingAwakened?.name} ${moment(comment.timestamp).fromNow()}`}
                  style={{ width: '94%' }}
                >
                    <RichTextEditor
                      id={`rte-commentDescription-${index}`}
                      value={comment.description}
                      style={{ padding: '5px', width: '94%' }}
                      readOnly={!editableComments[index]}
                    />

                    {comment.owner.uid !== currentUser.uid?<></>:
                    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: "0px" }}>
                        {editableComments[index]?
                            <Button variant='link' compact size="xs" onClick={() => toggleSave(index)}>Save</Button>:
                            <Button variant='link' compact size="xs" onClick={() => toggleEdit(index)}>Edit</Button>}
                            <Button variant='link' compact size="xs" onClick={() => openDeleteModal(index)}>Delete</Button>
                    </div>
                    }
                </Input.Wrapper>
            </Group>
            <Modal opened={deleteModalOpen} onClose={closeDeleteModal}>
            <Modal.Title>Delete Comment</Modal.Title>
            <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
            <Button onClick={closeDeleteModal}>Cancel</Button>
            <Button variant="error" onClick={() => deleteComment(commentToDeleteIndex, selectedBountyIndex)}>
                Delete
            </Button>
            </Modal>
            </div>
            )}
            )}
        </div>
        );
      };

    const [deleteModalOpen, setDeleteModalOpen] = useState(false); 

    const displayModal = (selectedBountyIndex: any) => {
        const ownerProfile = domainAwakenedList.find(awakened => awakened.id === bounties[selectedBountyIndex].owner.id)

        const deleteBounty = () => {
            const updatedBounties = [...bounties];
            updatedBounties.splice(selectedBountyIndex, 1);
            setSelectedBountyIndex(null)
            setBounties(updatedBounties)
            setDeleteModalOpen(false)
        };
        const openDeleteModal = () => {
            setDeleteModalOpen(true);
        };

        const closeDeleteModal = () => {
            setDeleteModalOpen(false);
        };

        return (
            <Modal opened onClose={() => {setSelectedBountyIndex(null); setShowNewCommentSection(false); setEditTitle(true); setEditDescription(true)}} size="50rem">
            <Stack>
                <Modal.Body>
                    <Stack>
                        <>
                            <div>
                            <Text fz="lg" color="dimmed">
                                <FontAwesomeIcon icon={faBookBookmark} /> Bounty Title
                            </Text>
                            <TextInput
                                size='xl'
                                placeholder="Bounty Title"
                                value={bounties[selectedBountyIndex].title}
                                readOnly={editTitle}
                                onChange={(event) =>
                                    handleBountyEdit(selectedBountyIndex, {
                                        ...bounties[selectedBountyIndex],
                                        title: event.target.value,
                                    })
                                }
                            />
                            {bounties[selectedBountyIndex].owner.uid !== currentUser.uid?<></>:
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                {editTitle?<Button variant='link' compact size="xs" onClick={() => setEditTitle(false)}>Edit</Button>:<Button variant='link' compact size="xs" onClick={() => setEditTitle(true)}>Save</Button>}
                            </div>
                            }
                            </div>
                            <div>
                            <Text fz="lg" color="dimmed">
                            <FontAwesomeIcon icon={faInfo} /> Description
                            </Text>
                            <Group>
                                <Text>Owner: </Text>
                                <Tooltip label={ownerProfile?.name} withArrow>
                                <Avatar src={ownerProfile?.background.profilePic} radius="xl"  size="sm" style={{ backgroundImage: ownerProfile? `linear-gradient(to bottom right, ${Paths[ownerProfile.path]?.color}, ${Orders[ownerProfile.order]?.color})` : 'none'}}/>
                                </Tooltip>
                                <Text>Updated: {moment(bounties[selectedBountyIndex].timestamp).fromNow()}</Text>
                            </Group>
                            <RichTextEditor
                                id="rte-editDescription"
                                readOnly={editDescription}
                                value={bounties[selectedBountyIndex].description}
                                style={{ padding: '10px' }}
                                onChange={(val) => 
                                    handleBountyEdit(selectedBountyIndex, {
                                        ...bounties[selectedBountyIndex],
                                        description: val,
                                    })
                                }
                            />
                            {bounties[selectedBountyIndex].owner.uid !== currentUser.uid?<></>:
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                {editDescription?
                                    <Button variant='link' compact size="xs" onClick={() => setEditDescription(false)}>Edit</Button>:
                                    <Button variant='link' compact size="xs" onClick={() => {setEditDescription(true); handleBountyEdit(selectedBountyIndex, {...bounties[selectedBountyIndex],timestamp: new Date().toISOString()});}}>Save</Button>}
                                    <Button variant='link' compact size="xs" onClick={() => openDeleteModal()}>Delete</Button>
                            </div>
                            }
                            </div>
                            <div>
                            <Text fz="lg" color="dimmed">
                            <FontAwesomeIcon icon={faList} /> Activity
                            </Text>
                            <CommentSection comments={bounties[selectedBountyIndex].activity} selectedBountyIndex={selectedBountyIndex} />
                            </div>
                            {showNewCommentSection ? (
                                <div>
                                    <RichTextEditor
                                    id="rte-newCommentDescription"
                                    placeholder='Write a comment...'
                                    readOnly={bounties[selectedBountyIndex].owner.uid !== currentUser.uid}
                                    value={newComment.description}
                                    onChange={(val) => setNewComment({ ...newComment, description: val })}
                                    style={{ padding: '5px', border: "solid white 1px" }}
                                    />
                                    <Select
                                    label="Comment as..."
                                    data={selectData}
                                    value={selectedCharacter}
                                    onChange={(val) => setSelectedCharacter(val)}
                                    placeholder='Select Character to post Bounty'
                                    itemComponent={SelectItem}
                                    searchable
                                    allowDeselect
                                    />
                                    <Button
                                    color='gray'
                                    onClick={() => {
                                        handleComment(selectedBountyIndex);
                                    }}
                                    >
                                    Save
                                    </Button>
                                </div>
                                ) : (
                                selectData.length === 0 ? null : (
                                    <Button color='gray' onClick={() => setShowNewCommentSection(true)}>New Comment...</Button>
                                )
                            )}
                        </>
                    </Stack>
                </Modal.Body>
            </Stack>
            <Modal opened={deleteModalOpen} onClose={closeDeleteModal}>
                <Modal.Title>Delete Comment</Modal.Title>
                <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
                <Button onClick={closeDeleteModal}>Cancel</Button>
                <Button variant="error" onClick={() => deleteBounty()}>
                    Delete
                </Button>
            </Modal>
        </Modal>
        )
    }


    const [showAsideBar, setShowAsideBar] = useState(!globals.isSmallScreen)
    useEffect(() => { setShowAsideBar(!globals.isSmallScreen) }, [globals.isSmallScreen])

    const height = globals.viewportHeightPx
    const scrollerHeight = 900

    const [showNewCommentSection, setShowNewCommentSection] = useState(false);
    const [newComment, setNewComment] = useState({
        owner: {
            id:'',
            uid:currentUser.uid,
        },
        description: "",
        timestamp: new Date().toISOString()
    })

    const [editTitle, setEditTitle] = useState(true) 
    const [editDescription, setEditDescription] = useState(true) 

    return (
        <>
        {showAsideBar ? (
            <Navbar width={{ base: 300 }} height={"100%"} p="sm">
                <Center h={"100%"}>
                    {height <= scrollerHeight ? (
                        <ScrollArea h={height - 100}>{questDisplay()}</ScrollArea>
                    ) : (
                        questDisplay()
                    )}
                    {createBountyModal()}
                    {selectedBountyIndex !== null && 
                    (
                        displayModal(selectedBountyIndex)
                    )}
                </Center>
            </Navbar>
        ) : (
            <></>
        )}
    </>
    )
}

export default MageBountyBoard