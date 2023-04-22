import { type NextPage } from "next";
import { useRouter } from "next/router";
import type { Engagement, POC, Assessment, Client } from "@prisma/client";
import * as XLSX from 'xlsx';

import { ExpandMore, FileDownload } from "@mui/icons-material";
import { Accordion, AccordionSummary, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, AccordionDetails, Button } from "@mui/material";

import { api } from "~/utils/api";
import { titleCase } from "~/utils/utils";
import Layout from "~/components/Layout/Layout";

const OversightAssessments: NextPage = () => {

    const { push } = useRouter();

    // TODO: Don't run query unless modal closed
    const { data } = api.engagement.getAllCompletedInclude.useQuery([true, true]);
    const exportData = api.assessment.getAllCompleted.useQuery(true).data;

    const exportCompleted = () => {
        if (exportData) {
            const sheet = XLSX.utils.json_to_sheet(exportData);
            const book = XLSX.utils.book_new();
            const filename = 'Shabas Completed Assessments ' + new Date().toLocaleDateString('fr-CA') + '.csv';
            XLSX.utils.book_append_sheet(book, sheet, 'Sheet1');
            XLSX.writeFile(book, filename, { bookType: 'csv' });
        }
    }

    return (
        <Layout active='completed-assessments'>
            <div className='dashboard'>
                <div className='browse-add'>
                    <Button
                        variant='contained'
                        startIcon={<FileDownload />}
                        onClick={exportCompleted}
                    >
                        Export
                    </Button>
                </div>
                {data && data.map((e: Engagement & { POC: POC[]; Assessment: Assessment[]; client: Client }, i) => {
                    return (
                        <Accordion key={i}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <TableContainer>
                                    <Table sx={{ minWidth: 650 }} size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Engagement ID</TableCell>
                                                <TableCell align="left">Client</TableCell>
                                                <TableCell align="left">Start Date</TableCell>
                                                <TableCell align="left">End Date</TableCell>
                                                <TableCell align="left">Client POC</TableCell>
                                                <TableCell align="left">Shabas POC</TableCell>
                                                <TableCell align="left">Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow
                                                key={i}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="center">{e.id}</TableCell>
                                                <TableCell align="left">{e.client_id} - {e.client.name}</TableCell>
                                                <TableCell align="left">{e.start_date.toDateString()}</TableCell>
                                                <TableCell align="left">{e.end_date.toDateString()}</TableCell>
                                                <TableCell align="left"></TableCell>
                                                <TableCell align="left"></TableCell>
                                                <TableCell align="left">{titleCase(e.status)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TableContainer>
                                    <Table sx={{ minWidth: 650 }} size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Assessment ID</TableCell>
                                                <TableCell align="left">Site</TableCell>
                                                <TableCell align="left">Start Date</TableCell>
                                                <TableCell align="left">End Date</TableCell>
                                                <TableCell align="left">Client POC</TableCell>
                                                <TableCell align="left">Assessors</TableCell>
                                                <TableCell align="left">Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {e.Assessment.map((a: Assessment, i) => {
                                                return (
                                                    <TableRow
                                                        key={i}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                                                        onClick={() => push(`/completed-assessments/${a.id}`)}
                                                        className='clickable-table-row'
                                                    >
                                                        <TableCell align="center">{a.id}</TableCell>
                                                        <TableCell align="left">{a.site_id}</TableCell>
                                                        <TableCell align="left">{a.start_date.toDateString()}</TableCell>
                                                        <TableCell align="left">{a.end_date.toDateString()}</TableCell>
                                                        <TableCell align="left"></TableCell>
                                                        <TableCell align="left"></TableCell>
                                                        <TableCell align="left">{titleCase(a.status)}</TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </AccordionDetails>
                        </Accordion>
                    )
                })}
            </div>
        </Layout>
    )
}

export default OversightAssessments;