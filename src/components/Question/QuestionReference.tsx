import type { Question } from "@prisma/client";
import { Card, Typography } from "@mui/material";

interface Props {
    data?: Question;
}

const QuestionReference: React.FC<Props> = (props) => {
    const { data } = props;

    return (
        <Card className='reference'>
            <div>
                <Typography>Interview Guide</Typography>
                1. Example<br />
                2. Example<br />
                3. Example<br />
                4. Example<br />
                5. Example<br />
                6. Example<br />
                7. Example
            </div>
            <div>
                <Typography>References</Typography>
                1. Example<br />
                2. Example<br />
                3. Example<br />
                4. Example<br />
                5. Example<br />
                6. Example<br />
                7. Example
            </div>
        </Card>
    )
}

export default QuestionReference;