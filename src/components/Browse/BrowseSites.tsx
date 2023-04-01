import React from "react";
import type { Site } from "@prisma/client";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import { api } from "~/utils/api";
import SiteModal from "../Modals/SiteModal";

const BrowseSites: React.FC = () => {

    const [siteData, setSiteData] = React.useState<Site | undefined>(undefined);
    const [siteModal, setSiteModal] = React.useState<boolean>(false);

    // const [sites, setSites] = React.useState<Site[]>([]);

    const sites = api.site.getAll.useQuery().data;

    // React.useEffect(() => {
    //     m.mutate()
    //     if (m.data) setSites(m.data)
    // }, [])

    return (
        <>
            <div className='browse-add'>
                <Button
                    variant='contained'
                    endIcon={<Add />}
                    onClick={() => { setSiteData(undefined); setSiteModal(true) }}
                >
                    New Site
                </Button>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Site ID</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Address</TableCell>
                            <TableCell align="left">Description</TableCell>
                            <TableCell align="center">Edit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sites && sites.map((data, i) => {
                            return (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="center">
                                        {data.id}
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.name}
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.street_address}<br />
                                        {data.city} {data.state}, {data.zip_code}
                                    </TableCell>
                                    <TableCell align="left">
                                        {data.description}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => { setSiteData(data); setSiteModal(true) }}>
                                            <Edit fontSize='small' />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <SiteModal open={siteModal} setOpen={setSiteModal} data={siteData} />
        </>
    );
};

export default BrowseSites;