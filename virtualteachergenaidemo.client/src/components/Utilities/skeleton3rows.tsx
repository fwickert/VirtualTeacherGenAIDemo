import {
    Skeleton,
    SkeletonItem,
    SkeletonProps
} from "@fluentui/react-skeleton";
import { makeStyles } from "@fluentui/react-components";
import {tokens} from "@fluentui/react-theme";

const useStyles = makeStyles({
    invertedWrapper: {
        backgroundColor: tokens.colorNeutralBackground1,
    },
    firstRow: {
        alignItems: "center",
        display: "grid",
        paddingBottom: "10px",
        position: "relative",
        gap: "10px",
        gridTemplateColumns: "min-content 80%",
    },
    secondThirdRow: {
        alignItems: "center",
        display: "grid",
        paddingBottom: "10px",
        position: "relative",
        gap: "10px",
        gridTemplateColumns: "min-content 20% 20% 15% 15%",
    },
});

export const Skeleton3Rows = (props: Partial<SkeletonProps>) => {
    const styles = useStyles();
    return (
        <div className={styles.invertedWrapper}>
            <Skeleton {...props} aria-label="Loading Content">
                <div className={styles.firstRow}>
                    <SkeletonItem shape="circle" size={24} />
                    <SkeletonItem shape="rectangle" size={16} />
                </div>
                <div className={styles.secondThirdRow}>
                    <SkeletonItem shape="circle" size={24} />
                    <SkeletonItem size={16} />
                    <SkeletonItem size={16} />
                    <SkeletonItem size={16} />
                    <SkeletonItem size={16} />
                </div>
                <div className={styles.secondThirdRow}>
                    <SkeletonItem shape="square" size={24} />
                    <SkeletonItem size={16} />
                    <SkeletonItem size={16} />
                    <SkeletonItem size={16} />
                    <SkeletonItem size={16} />
                </div>
            </Skeleton>
        </div>
    );
};