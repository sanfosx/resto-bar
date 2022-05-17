import react from "react";
import styled from "styled-components";

const Dialogs = ({
    children, 
    state, 
    changeStateDialog, 
    paddingDialog,
    positionDialog,
    titleDialog, 
    showHeaderDialog,
    showOverlayDialog,
    showCloseBtn,
    userId,
    setUserId,
    

}) => {

    return (

        <>
        {state &&
            <Overlay showOverlayDialog={showOverlayDialog} positionDialog={positionDialog}>
                <DialogContainer paddingDialog={paddingDialog} className='alert alert-dismissible alert-danger'>
                    {showHeaderDialog &&
                        <DialogHeader>
                        <h3>{titleDialog}</h3>
                        </DialogHeader>
                    }
                    {showCloseBtn &&
                      <BtnCloseDialog onClick={() => {changeStateDialog(false)}}>
                        <i className='material-icons text-info'>close</i>
                      </BtnCloseDialog>
                    }
                        {children}
                </DialogContainer>

            </Overlay>
        }
    </>

    )
};

export default Dialogs



const Overlay = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index:99;
    background: ${props => props.showOverlayDialog ? 'rgba(0,0,0,.5)' : 'rgba(0,0,0,0)'} ;

    display: flex;
	align-items: ${props => props.positionDialog ? props.positionDialog : 'center'};
	justify-content: center;
    padding: 20px;
`;

const DialogContainer = styled.div`
    width: 500px;
    min-height: 100px;
    position: relative;
    border-radius: 5px;
    top: 0;
    left: 0;
    background: #FFF;
    box-shadow: rgba(0,0,111, 0.2) 0px 7px 29px 8px;
    padding: ${props => props.paddingDialog ? props.paddingDialog : '20px'};
`;

const DialogHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #E8E8E8;

    h3 {
		font-weight: 500;
		font-size: 16px;
		color: #1766dc;
    
    }

`;

const BtnCloseDialog = styled.div`
    position: absolute;
    background:none;
    top: 15px;
    right: 15px;
    width: 30px;
    height: 30px;
    border: none;
    cursor: pointer;
    transition: 3s ease all;
    border-radius: 5px;
    color: #1766dc;

     hover{
        background: dimgray;
    }

    svg {
        width: 100%;
        height: 100%;
    }

`;