import {IMedia} from "interfaces";

interface MediaProps {
    userId: number,
    media: IMedia[]
}

export const Media = (props: MediaProps) => {
    const {media} = props
    return (
        <div>{JSON.stringify(media)}</div>
    )
}
