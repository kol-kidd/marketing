import { FaEllipsisH } from "react-icons/fa";
import { IconButton } from "rsuite";

export const renderIconButton = (props, ref) => {
    return (
      <IconButton {...props} ref={ref} icon={<FaEllipsisH />}  color="blue" appearance="ghost" />
    );
  };

  