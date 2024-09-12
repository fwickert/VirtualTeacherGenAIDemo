import {
    Skeleton,
    SkeletonItem,
    makeStyles,
    tokens,
} from "@fluentui/react-components";
import type { SkeletonProps } from "@fluentui/react-components";

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

export const Skeleton2Rows = (props: Partial<SkeletonProps>) => {
    const styles = useStyles();
    return (
        <div className={styles.invertedWrapper}>
            <Skeleton {...props} aria-label="Loading Content" animation="pulse">
                <div className={styles.secondThirdRow}>
                    <SkeletonItem shape="circle" size={24} />
                    <SkeletonItem size={16} />
                    <SkeletonItem size={16} />
                    <SkeletonItem size={16} />
                    <SkeletonItem size={16} />
                </div>
                <div className={styles.secondThirdRow}>
                    <SkeletonItem shape="circle" size={24} />
                    <SkeletonItem size={16} />
                    <SkeletonItem size={16} />
                    <SkeletonItem size={16} />
                    <SkeletonItem size={16} />
                </div>               
            </Skeleton>
        </div>
    );
};