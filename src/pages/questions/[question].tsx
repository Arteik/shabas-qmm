/* eslint-disable @typescript-eslint/restrict-plus-operands */
import * as React from 'react';
import { type NextPage } from "next";
import Router, { useRouter } from 'next/router';
import type { Filter } from '@prisma/client';

import {
    Button, Card, Grid, IconButton, MenuItem, Select,
    TextField, ToggleButton, ToggleButtonGroup, Typography
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

import { api } from "~/utils/api";
import Layout from "~/components/Layout/Layout";
import IndustryModal from '~/components/Modals/QuestionFilters/IndustryModal';
import ApiSegmentModal from '~/components/Modals/QuestionFilters/ApiSegmentModal';
import SiteSpecificModal from '~/components/Modals/QuestionFilters/SiteSpecificModal';
import QuestionsSidebar from '~/components/Assessment/QuestionsSidebar';

interface GuideType {
    id?: number;
    num: number;
    interview_question: string;
}

interface ReferenceType {
    id?: number;
    num: number;
    citation: string;
}

interface RatingType {
    id?: number;
    level_number: number;
    criteria: string;
    progression_statement: string;
}

const Question: NextPage = () => {

    const { push } = useRouter();

    const { question } = useRouter().query;

    const [filterType, setFilterType] = React.useState<string>('standard');
    const [filterSelection, setFilterSelection] = React.useState<Filter | null>(null);
    const [addIndustry, setAddIndustry] = React.useState<boolean>(false);
    const [addApiSegment, setAddApiSegment] = React.useState<boolean>(false);
    const [addSiteSpecific, setAddSiteSpecific] = React.useState<boolean>(false);


    const { data } = api.question.getById.useQuery({ id: Number(question) });

    const guideData = api.interviewGuide.getByQuestionId.useQuery({ id: Number(question) }).data;
    const referencesData = api.reference.getByQuestionId.useQuery({ id: Number(question) }).data;
    const SME = api.sme.getByQuestionId.useQuery({ id: Number(question) }).data;
    const ratingData = api.rating.getByQuestionFilter.useQuery({
        questionId: Number(question),
        filterId: (filterType != 'standard' && filterSelection) ? filterSelection.id : undefined,
    }).data;

    // =========== Input Field States ===========

    const [active, setActive] = React.useState<boolean>(true);
    const [number, setNumber] = React.useState<string>('');
    const [questionContent, setQuestionContent] = React.useState<string>('');
    const [pillar, setPillar] = React.useState<string>('');
    const [practiceArea, setPracticeArea] = React.useState<string>('');
    const [topicArea, setTopicArea] = React.useState<string>('');
    const [hint, setHint] = React.useState<string>('');
    const [priority, setPriority] = React.useState<string>('');

    const [firstName, setFirstName] = React.useState<string>('');
    const [lastName, setLastName] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const [phone, setPhone] = React.useState<string>('');

    const [existingGuide, setExistingGuide] = React.useState<GuideType[]>([]);
    const [newGuide, setNewGuide] = React.useState<GuideType[]>([{ num: 1, interview_question: '' }]);
    const [deletedGuide, setDeletedGuide] = React.useState<GuideType[]>([]);

    const [existingReferences, setExistingReferences] = React.useState<ReferenceType[]>([]);
    const [newReferences, setNewReferences] = React.useState<ReferenceType[]>([{ num: 1, citation: '' }]);
    const [deletedReferences, setDeletedReferences] = React.useState<ReferenceType[]>([]);

    const [existingRatings, setExistingRatings] = React.useState<RatingType[]>([]);
    const [newRatings, setNewRatings] = React.useState<RatingType[]>([]);


    React.useEffect(() => {
        if (SME) {
            setFirstName(SME.first_name);
            setLastName(SME.last_name);
            setEmail(SME.email);
            setPhone(SME.mobile_phone);
        }
    }, [SME]);

    React.useEffect(() => {
        if (guideData) {
            let count = 0;
            const existingArray = guideData.map(o => {
                count++;
                return {
                    id: o.id,
                    num: count,
                    interview_question: o.interview_question,
                }
            });
            setExistingGuide(existingArray);
            const array = newGuide.map(o => {
                count++;
                return {
                    num: count,
                    interview_question: o.interview_question,
                }
            });
            setNewGuide(array);
        }
    }, [guideData]);

    React.useEffect(() => {
        if (referencesData) {
            let count = 0;
            const existingArray = referencesData.map(o => {
                count++;
                return {
                    id: o.id,
                    num: count,
                    citation: o.citation,
                }
            });
            setExistingReferences(existingArray);
            const array = newReferences.map(o => {
                count++;
                return {
                    ...o,
                    num: count,
                }
            });
            setNewReferences(array);
        }
    }, [referencesData])

    React.useEffect(() => {
        if (ratingData) {
            let count = 0;
            const existingArray = ratingData.map(o => {
                count++;
                return {
                    id: o.id,
                    level_number: count,
                    criteria: o.criteria,
                    progression_statement: o.progression_statement,
                }
            });
            setExistingRatings(existingArray);
            const array = newRatings.map(o => {
                count++;
                return {
                    ...o,
                    level_number: count,
                }
            });
            setNewRatings(array);
        }
    }, [ratingData])

    const handleGuideChange = (num: number, newVal: string, existing?: boolean) => {
        const ref = existing ? existingGuide : newGuide;
        const newArr = ref.map(o => {
            if (o.num == num) {
                return {
                    ...o,
                    interview_question: newVal,
                }
            }
            return o;
        });
        if (existing) {
            setExistingGuide(newArr);
        } else {
            setNewGuide(newArr);
        }
    }

    const handleReferenceChange = (num: number, newVal: string, existing?: boolean) => {
        const ref = existing ? existingReferences : newReferences;
        const newArr = ref.map(o => {
            if (o.num == num) {
                return {
                    ...o,
                    citation: newVal,
                }
            }
            return o;
        });
        if (existing) {
            setExistingReferences(newArr);
        } else {
            setNewReferences(newArr);
        }
    }

    const handleRatingChange = (num: number, newVal: string, criteria?: boolean, existing?: boolean) => {
        const ref = existing ? existingRatings : newRatings;
        const newArr = ref.map(o => {
            if (o.level_number == num) {
                if (criteria)
                    return {
                        ...o,
                        criteria: newVal,
                    }
                return {
                    ...o,
                    progression_statement: newVal,
                }
            }
            return o;
        });
        if (existing) {
            setExistingRatings(newArr);
        } else {
            setNewRatings(newArr);
        }
    }

    // =========== Submission Management ===========

    const create = api.question.create.useMutation();
    const update = api.question.update.useMutation();
    const changeActive = api.question.active.useMutation();

    const createGuide = api.interviewGuide.create.useMutation();
    const updateGuide = api.interviewGuide.update.useMutation();
    const deleteGuide = api.interviewGuide.delete.useMutation();

    const createReference = api.reference.create.useMutation();
    const updateReference = api.reference.update.useMutation();
    const deleteReference = api.reference.delete.useMutation();

    const createSME = api.sme.create.useMutation();
    const updateSME = api.sme.update.useMutation();

    const createRating = api.rating.create.useMutation();
    const updateRating = api.rating.update.useMutation();

    React.useEffect(() => {
        if (data) {
            setActive(data.active);
            setNumber(data.number);
            setQuestionContent(data.question);
            setPillar(data.pillar);
            setPracticeArea(data.practice_area);
            setTopicArea(data.topic_area);
            setHint(data.hint);
            setPriority(data.priority);
        }
    }, [data])

    const handleActive = () => {
        if (data) {
            changeActive.mutate({
                id: data.id,
                active: !active,
            }, {
                onSuccess() { Router.reload() }
            })
        }
    }

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (data) {
            let succeeded = true;

            update.mutate({
                id: data.id,
                active: active,
                number: number,
                question: questionContent,
                pillar: pillar,
                practice_area: practiceArea,
                topic_area: topicArea,
                hint: hint,
                priority: priority,
            }, {
                onError(err) {
                    succeeded = false;
                    console.log(err);
                }
            })


            existingGuide.forEach(o => {
                updateGuide.mutate({
                    id: o.id,
                    active: true,
                    interview_question: o.interview_question,
                    question_id: data.id,
                    site_id: 1,
                    filter_id: filterSelection ? filterSelection.id : 1,
                }, {
                    onError(err) {
                        succeeded = false;
                        console.log(err);
                    }
                })
            })
            newGuide.slice().reverse().forEach(o => {
                if (o.interview_question != '') {
                    createGuide.mutate({
                        active: true,
                        interview_question: o.interview_question,
                        question_id: data.id,
                        site_id: 1,
                        filter_id: filterSelection ? filterSelection.id : 1,
                    }, {
                        onError(err) {
                            succeeded = false;
                            console.log(err);
                        }
                    })
                }
            })
            deletedGuide.forEach(o => {
                if (o.id) {
                    deleteGuide.mutate(o.id, {
                        onError(err) {
                            succeeded = false;
                            console.log(err);
                        }
                    })
                }
            })


            existingReferences.forEach(o => {
                updateReference.mutate({
                    id: o.id,
                    citation: o.citation,
                    question_id: data.id,
                }, {
                    onError(err) {
                        succeeded = false;
                        console.log(err);
                    }
                })
            })
            newReferences.slice().reverse().forEach(o => {
                if (o.citation != '') {
                    createReference.mutate({
                        citation: o.citation,
                        question_id: data.id,
                    }, {
                        onError(err) {
                            succeeded = false;
                            console.log(err);
                        }
                    })
                }
            })
            deletedReferences.forEach(o => {
                if (o.id) {
                    deleteReference.mutate(o.id, {
                        onError(err) {
                            succeeded = false;
                            console.log(err);
                        }
                    })
                }
            })

            existingRatings.forEach(o => {
                updateRating.mutate({
                    id: o.id,
                    active: true,
                    level_number: o.level_number.toString(),
                    criteria: o.criteria,
                    progression_statement: o.progression_statement,
                    question_id: data.id,
                    filter_id: (filterType != 'standard' && filterSelection) ? filterSelection.id : undefined,
                }, {
                    onError(err) {
                        succeeded = false;
                        console.log(err);
                    }
                })
            })
            newRatings.slice().reverse().forEach(o => {
                if (o.criteria != '' || o.progression_statement != '') {
                    createRating.mutate({
                        active: true,
                        level_number: o.level_number.toString(),
                        criteria: o.criteria,
                        progression_statement: o.progression_statement,
                        question_id: data.id,
                        filter_id: (filterType != 'standard' && filterSelection) ? filterSelection.id : undefined,
                    }, {
                        onError(err) {
                            succeeded = false;
                            console.log(err);
                        }
                    })
                }
            })


            if (SME) {
                updateSME.mutate({
                    id: SME.id,
                    first_name: firstName,
                    last_name: lastName,
                    mobile_phone: phone,
                    email: email,
                    question_id: data.id,
                }, {
                    onError(err) {
                        succeeded = false;
                        console.log(err);
                    }
                })
            } else {
                createSME.mutate({
                    first_name: firstName,
                    last_name: lastName,
                    mobile_phone: phone,
                    email: email,
                    question_id: data.id,
                }, {
                    onError(err) {
                        succeeded = false;
                        console.log(err);
                    }
                })
            }

            if (succeeded) {
                Router.reload();
            }
        }
    }

    const setQuestionSelection = (question: number) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        push(`/questions/${question}`);
    }

    // =========== Retrieve Form Context ===========

    const questions = api.question.getAll.useQuery(true).data;

    // TODO: Don't run query unless modal closed
    const industries = api.filter.getAllIndustry.useQuery(addIndustry).data;
    const apiSegments = api.filter.getAllApiSegment.useQuery(addApiSegment).data;
    const siteSpecifics = api.filter.getAllSiteSpecific.useQuery(addSiteSpecific).data;

    const filterSelect = () => {
        if (filterType == 'standard') return;

        let filterOptions: Filter[] | undefined = industries;
        if (filterType == 'api-segment') filterOptions = apiSegments;
        if (filterType == 'site-specific') filterOptions = siteSpecifics;

        return (<>
            <Typography style={{ padding: '0px 10px 0px 5px' }}>:</Typography>
            <Select
                size='small' displayEmpty
                value={filterSelection ? filterSelection.id : ''}
                onChange={(event) => {
                    if (filterOptions) {
                        const selected = filterOptions.find(o => o.id == event.target.value);
                        if (selected) setFilterSelection(selected);
                    }
                }}
            >
                <MenuItem value=''><em>Select a filter...</em></MenuItem>
                {filterOptions?.map((o, i) => {
                    return <MenuItem key={i} value={o.id}>{o.name}</MenuItem>;
                })}
                <MenuItem>
                    <Button
                        variant='contained'
                        onClick={() => {
                            if (filterType == 'industry') setAddIndustry(true)
                            if (filterType == 'api-segment') setAddApiSegment(true)
                            if (filterType == 'site-specific') setAddSiteSpecific(true)
                        }}
                    >
                        <Add />
                        {filterType == 'industry' && 'Add Industry'}
                        {filterType == 'api-segment' && 'Add API Segment'}
                        {filterType == 'site-specific' && 'Add Site Specific'}
                    </Button>
                </MenuItem>
            </Select>
        </>)
    }

    return (
        <Layout active='questions'>
            <form onSubmit={handleSubmit}>
                <div className='assessment'>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            {questions &&
                                <QuestionsSidebar
                                    questions={questions}
                                    question={Number(question)}
                                    setQuestion={setQuestionSelection}
                                    addOption
                                />
                            }
                        </Grid>
                        <Grid item xs={10} container spacing={2}>
                            <Grid item xs={12}>
                                <Card className='context'>
                                    <div>
                                        <Typography>Question #</Typography>
                                        <TextField
                                            name='number' size='small'
                                            value={number}
                                            onChange={e => setNumber(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Typography>Pillar</Typography>
                                        <TextField
                                            name='pillar' size='small'
                                            value={pillar}
                                            onChange={e => setPillar(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Typography>Practice Area</Typography>
                                        <TextField
                                            name='practiceArea' size='small'
                                            value={practiceArea}
                                            onChange={e => setPracticeArea(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Typography>Topic Area</Typography>
                                        <TextField
                                            name='topicArea' size='small'
                                            value={topicArea}
                                            onChange={e => setTopicArea(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Typography>Priority</Typography>
                                        <TextField
                                            name='priority' size='small'
                                            value={priority}
                                            onChange={e => setPriority(e.target.value)}
                                        />
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={8}>
                                <Card className='question-content'>
                                    <Typography>Question Content</Typography>
                                    <TextField
                                        name='question' size='small' multiline
                                        value={questionContent}
                                        onChange={e => setQuestionContent(e.target.value)}
                                    />
                                    <div className='filters'>
                                        <ToggleButtonGroup
                                            exclusive
                                            size='small'
                                            value={filterType}
                                            onChange={(_event, value: string) => { if (value) { setFilterType(value); setFilterSelection(null); setNewRatings([]) } }}
                                        >
                                            <ToggleButton value='standard'>Standard</ToggleButton>
                                            <ToggleButton value='industry'>Industry</ToggleButton>
                                            <ToggleButton value='api-segment'>API Segment</ToggleButton>
                                            <ToggleButton value='site-specific'>Site Specific</ToggleButton>
                                        </ToggleButtonGroup>
                                        {filterSelect()}
                                    </div>
                                    {!(filterType != 'standard' && filterSelection == null) &&
                                        <>
                                            {existingRatings.map((o, i) => {
                                                if (i <= 4)
                                                    return (
                                                        <div key={i}>
                                                            <Typography>Level {o.level_number}</Typography>
                                                            <TextField
                                                                placeholder='Criteria...' size='small' multiline
                                                                value={o.criteria}
                                                                onChange={(event) => handleRatingChange(o.level_number, event.target.value, true, true)}
                                                            />
                                                            {((i != existingRatings.length - 1 || newRatings.length != 0) && i < 4) &&
                                                                <>
                                                                    <Typography>Progression Statement</Typography>
                                                                    <TextField
                                                                        placeholder='Progression statement...' size='small' multiline
                                                                        value={o.progression_statement}
                                                                        onChange={(event) => handleRatingChange(o.level_number, event.target.value, false, true)}
                                                                    />
                                                                </>
                                                            }
                                                        </div>
                                                    )
                                                return undefined;
                                            })}
                                            {existingRatings.length < 5 && newRatings.map((o, i) => {
                                                return (
                                                    <div key={i}>
                                                        <Typography>Level {o.level_number}</Typography>
                                                        <TextField
                                                            placeholder='Criteria...' size='small' multiline
                                                            value={o.criteria}
                                                            onChange={(event) => handleRatingChange(o.level_number, event.target.value, true)}
                                                        />
                                                        {(i != newRatings.length - 1) &&
                                                            <>
                                                                <Typography>Progression Statement</Typography>
                                                                <TextField
                                                                    placeholder='Progression statement...' size='small' multiline
                                                                    value={o.progression_statement}
                                                                    onChange={(event) => handleRatingChange(o.level_number, event.target.value, false)}
                                                                />
                                                            </>
                                                        }
                                                    </div>
                                                )
                                            })}
                                            {newRatings.length < 5 &&
                                                <Button
                                                    variant='outlined' startIcon={<Add />}
                                                    onClick={() => {
                                                        let num = existingRatings.length + 1;
                                                        const last = newRatings[newRatings.length - 1];
                                                        if (newRatings.length > 0 && last) num = last.level_number + 1;
                                                        setNewRatings([
                                                            ...newRatings,
                                                            {
                                                                level_number: num,
                                                                criteria: '',
                                                                progression_statement: ''
                                                            }
                                                        ])
                                                    }}
                                                >
                                                    Add Rating
                                                </Button>
                                            }
                                        </>
                                    }
                                </Card>
                                <Card className='actions' style={{ marginTop: 16 }}>
                                    <Button
                                        variant='contained'
                                        color={active ? 'error' : 'success'}
                                        onClick={() => handleActive()}
                                    >
                                        {active ? 'Deactivate' : 'Activate'}
                                    </Button>
                                    <Button variant='contained' type='submit'>Save</Button>
                                </Card>
                            </Grid>
                            <Grid item xs={4}>
                                <Card className='reference'>
                                    <div>
                                        <Typography>Interview Guide</Typography>
                                        {existingGuide.map((o, i) => {
                                            return (
                                                <div key={i} className='input-row'>
                                                    <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                                                    <TextField
                                                        placeholder='Reference...' size='small'
                                                        value={o.interview_question}
                                                        onChange={(event) => handleGuideChange(o.num, event.target.value, true)}
                                                    />
                                                    <IconButton
                                                        color='default'
                                                        onClick={() => {
                                                            const newDeleted = deletedGuide;
                                                            newDeleted.push(o);
                                                            setDeletedGuide(newDeleted);

                                                            let count = 0;
                                                            const newExisting: GuideType[] = []
                                                            existingGuide.map(x => {
                                                                if (x.id != o.id) {
                                                                    count++;
                                                                    newExisting.push({
                                                                        ...x,
                                                                        num: count,
                                                                    })
                                                                }
                                                            });
                                                            setExistingGuide(newExisting);

                                                            const newNew: GuideType[] = []
                                                            newGuide.map(x => {
                                                                count++;
                                                                newNew.push({
                                                                    ...x,
                                                                    num: count,
                                                                })
                                                            });
                                                            setNewGuide(newNew);
                                                        }}
                                                    ><Delete /></IconButton>
                                                </div>
                                            )
                                        })}
                                        {newGuide.map((o, i) => {
                                            if (i == newGuide.length - 1)
                                                return (
                                                    <div key={i} className='input-row'>
                                                        <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                                                        <TextField
                                                            placeholder='Reference...' size='small'
                                                            value={o.interview_question}
                                                            onChange={(event) => handleGuideChange(o.num, event.target.value)}
                                                        />
                                                        <IconButton
                                                            onClick={() => {
                                                                const last = newGuide[newGuide.length - 1];
                                                                if (last) setNewGuide([...newGuide, { num: last.num + 1, interview_question: '' }])
                                                            }}
                                                        ><Add /></IconButton>
                                                    </div>
                                                )
                                            return (
                                                <div key={i} className='input-row'>
                                                    <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                                                    <TextField
                                                        placeholder='Reference...' size='small'
                                                        value={o.interview_question}
                                                        onChange={(event) => handleGuideChange(o.num, event.target.value)}
                                                    />
                                                    <IconButton
                                                        color='default'
                                                        onClick={() => {
                                                            if (newGuide[0]) {
                                                                let newIndex = (newGuide[0]?.num) - 1;
                                                                const removed: GuideType[] = [];
                                                                newGuide.forEach(d => {
                                                                    if (d.num != o.num) {
                                                                        newIndex++;
                                                                        removed.push({
                                                                            ...d,
                                                                            num: newIndex,
                                                                        })
                                                                    }
                                                                    return;

                                                                });
                                                                setNewGuide(removed);
                                                            }
                                                        }}
                                                    ><Delete /></IconButton>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div>
                                        <Typography>References</Typography>
                                        {existingReferences.map((o, i) => {
                                            return (
                                                <div key={i} className='input-row'>
                                                    <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                                                    <TextField
                                                        placeholder='Reference...' size='small'
                                                        value={o.citation}
                                                        onChange={(event) => handleReferenceChange(o.num, event.target.value, true)}
                                                    />
                                                    <IconButton
                                                        color='default'
                                                        onClick={() => {
                                                            const newDeleted = deletedReferences;
                                                            newDeleted.push(o);
                                                            setDeletedReferences(newDeleted);

                                                            let count = 0;
                                                            const newExisting: ReferenceType[] = []
                                                            existingReferences.map(x => {
                                                                if (x.id != o.id) {
                                                                    count++;
                                                                    newExisting.push({
                                                                        ...x,
                                                                        num: count,
                                                                    })
                                                                }
                                                            });
                                                            setExistingReferences(newExisting);

                                                            const newNew: ReferenceType[] = []
                                                            newReferences.map(x => {
                                                                count++;
                                                                newNew.push({
                                                                    ...x,
                                                                    num: count,
                                                                })
                                                            });
                                                            setNewReferences(newNew);
                                                        }}
                                                    ><Delete /></IconButton>
                                                </div>
                                            )
                                        })}
                                        {newReferences.map((o, i) => {
                                            if (i == newReferences.length - 1)
                                                return (
                                                    <div key={i} className='input-row'>
                                                        <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                                                        <TextField
                                                            placeholder='Reference...' size='small'
                                                            value={o.citation}
                                                            onChange={(event) => handleReferenceChange(o.num, event.target.value)}
                                                        />
                                                        <IconButton
                                                            onClick={() => {
                                                                const last = newReferences[newReferences.length - 1];
                                                                if (last) setNewReferences([...newReferences, { num: last.num + 1, citation: '' }])
                                                            }}
                                                        ><Add /></IconButton>
                                                    </div>
                                                )
                                            return (
                                                <div key={i} className='input-row'>
                                                    <Typography style={{ paddingRight: 10 }}>{o.num}.</Typography>
                                                    <TextField
                                                        placeholder='Reference...' size='small'
                                                        value={o.citation}
                                                        onChange={(event) => handleReferenceChange(o.num, event.target.value)}
                                                    />
                                                    <IconButton
                                                        color='default'
                                                        onClick={() => {
                                                            if (newGuide[0]) {
                                                                let newIndex = (newGuide[0]?.num) - 1;
                                                                const removed: ReferenceType[] = [];
                                                                newReferences.forEach(d => {
                                                                    if (d.num != o.num) {
                                                                        newIndex++;
                                                                        removed.push({
                                                                            ...d,
                                                                            num: newIndex,
                                                                        })
                                                                    }
                                                                    return;

                                                                });
                                                                setNewReferences(removed);
                                                            }
                                                        }}
                                                    ><Delete /></IconButton>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div>
                                        <Typography>SME Info</Typography>
                                        <TextField
                                            name='firstName' label='First Name' size='small'
                                            value={firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                        />
                                        <TextField
                                            name='lastName' label='Last Name' size='small'
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                        />
                                        <TextField
                                            name='phone' label='Phone Number' size='small'
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                        />
                                        <TextField
                                            name='email' label='Email' size='small'
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Typography>Owned By:</Typography>
                                        <Typography>{'Updated At: ' + data?.updated_at.toLocaleString()}</Typography>
                                        <Typography>{'Updated By: ' + data?.updated_by}</Typography>
                                        <Typography>{'Created At: ' + data?.created_at.toLocaleString()}</Typography>
                                        <Typography>{'Created By: ' + data?.created_by}</Typography>
                                    </div>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                <IndustryModal open={addIndustry} setOpen={setAddIndustry} />
                <ApiSegmentModal open={addApiSegment} setOpen={setAddApiSegment} />
                <SiteSpecificModal open={addSiteSpecific} setOpen={setAddSiteSpecific} />
            </form>
        </Layout>
    );
};

export default Question;