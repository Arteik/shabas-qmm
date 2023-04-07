import React from "react";
import type { POC } from "@prisma/client";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import { api } from "~/utils/api";
import POCModal from "../Modals/POCModal";

interface Props {
    pocModal: boolean;
    setPOCModal: (open: boolean) => void;
}

const BrowsePOCs: React.FC<Props> = (props) => {

    const { pocModal, setPOCModal } = props;

    const [pocData, setPOCData] = React.useState<POC | undefined>(undefined);

    // TODO: Don't run query unless modal closed
    const pocs = api.poc.getAllInclude.useQuery(pocModal).data;

    console.log(pocs)

    return (
        <>
            <div className='browse-add'>
                <Button
                    variant='contained'
                    endIcon={<Add />}
                    onClick={() => { setPOCData(undefined); setPOCModal(true) }}
                >
                    New POC
                </Button>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">POC ID</TableCell>
                            <TableCell align="left">Type</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Title</TableCell>
                            <TableCell align="left">Work Phone</TableCell>
                            <TableCell align="left">Mobile Phone</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Staff</TableCell>
                            <TableCell align="center">Edit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pocs && pocs.map((data, i) => {
                            return (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="center">
                                        {data.id}
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.Client ? 'Client' : 'Shabas'}
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.first_name} {data.last_name}
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.title}
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.work_phone}
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.mobile_phone}
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.email}
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.staff}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => { setPOCData(data); setPOCModal(true) }}>
                                            <Edit fontSize='small' />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <POCModal open={pocModal} setOpen={setPOCModal} data={pocData} />
        </>
    );
};

export default BrowsePOCs;